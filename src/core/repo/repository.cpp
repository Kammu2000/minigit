#include <chrono>
#include <ctime>
#include <fstream>
#include <functional>
#include <set>
#include <sstream>

#include "minigit/core/diff/diff_engine.hpp"
#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/repo/repository.hpp"
#include "minigit/core/repo/worktree_scanner.hpp"
#include "minigit/core/tree/tree_builder.hpp"
#include "minigit/common/util/error.hpp"
#include "minigit/common/util/paths.hpp"

namespace minigit::repo {

Repository::Repository(std::filesystem::path root, storage::ObjectStore objects, Index index,
                       Refs refs, IgnoreRules ignore_rules)
    : root_(std::move(root)), objects_(std::move(objects)), index_(std::move(index)),
      refs_(std::move(refs)), ignore_rules_(std::move(ignore_rules))
{
}

Repository Repository::init(const std::filesystem::path& root)
{
    const auto minigit = root / ".minigit";
    if (std::filesystem::exists(minigit))
    {
        throw Error(ErrorCode::RepoAlreadyExists,
                    "REPOSITORY_ALREADY_INITIALIZED_ERROR: Already a minigit repository");
    }

    std::filesystem::create_directories(minigit / "objects");
    std::filesystem::create_directories(minigit / "refs" / "heads");

    std::ofstream(minigit / "HEAD") << "ref: refs/heads/main\n";
    std::ofstream(minigit / "refs" / "heads" / "main");

    storage::ObjectStore objects(root);
    Index index(root / ".minigit" / "index");
    Refs refs(minigit);
    IgnoreRules ignore_rules(root);
    return Repository(root, std::move(objects), std::move(index), std::move(refs),
                      std::move(ignore_rules));
}

Repository Repository::open(const std::filesystem::path& root)
{
    const auto minigit = root / ".minigit";
    if (!std::filesystem::exists(minigit))
    {
        throw Error(ErrorCode::RepoNotFound, "not a minigit repository");
    }

    storage::ObjectStore objects(root);
    Index index(root / ".minigit" / "index");
    index.load();
    Refs refs(minigit);
    IgnoreRules ignore_rules(root);
    return Repository(root, std::move(objects), std::move(index), std::move(refs),
                      std::move(ignore_rules));
}

void Repository::stage(const std::vector<std::string>& paths)
{
    for (const auto& relative_path : paths)
    {
        const auto entity_path = root_ / relative_path;
        if (!std::filesystem::exists(entity_path))
        {
            index_.unstage(relative_path);
            index_.save();
            continue;
        }

        if (ignore_rules_.is_ignored(relative_path))
        {
            continue;
        }

        if (std::filesystem::is_directory(entity_path))
        {
            for (const auto& entry : std::filesystem::recursive_directory_iterator(entity_path))
            {
                if (!entry.is_regular_file())
                {
                    continue;
                }
                const auto rel =
                    util::normalize_repo_path(std::filesystem::relative(entry.path(), root_));
                if (ignore_rules_.is_ignored(rel))
                {
                    continue;
                }
                const auto sha = objects_.hash_file(entry.path(), true);
                index_.stage(rel, model::StagedEntry{model::FileMode::Blob, sha});
            }
        }
        else if (std::filesystem::is_regular_file(entity_path))
        {
            const auto sha = objects_.hash_file(entity_path, true);
            index_.stage(relative_path, model::StagedEntry{model::FileMode::Blob, sha});
        }
    }
    index_.save();
}

void Repository::unstage(const std::string& path)
{
    index_.unstage(path);
    index_.save();
}

std::unordered_map<std::string, model::ObjectId> Repository::head_map() const
{
    std::unordered_map<std::string, model::ObjectId> head_map;

    const auto commit_id = refs_.head_commit();
    if (!commit_id)
    {
        return head_map;
    }

    const auto commit_obj = objects_.read(*commit_id);
    const std::string commit_body(commit_obj.body.begin(), commit_obj.body.end());
    std::istringstream stream(commit_body);
    std::string line;
    std::optional<model::ObjectId> tree_sha;

    while (std::getline(stream, line))
    {
        if (line.starts_with("tree "))
        {
            tree_sha = model::ObjectId::from_hex(line.substr(5));
            break;
        }
    }

    if (!tree_sha)
    {
        return head_map;
    }

    std::function<void(const model::ObjectId&, const std::string&)> walk;
    walk = [&](const model::ObjectId& tree_id, const std::string& current_path) {
        const auto tree_obj = objects_.read(tree_id);
        const auto entries = tree::TreeCodec::decode(tree_obj.body);
        for (const auto& entry : entries)
        {
            const std::string updated_path =
                current_path.empty() ? entry.name : current_path + "/" + entry.name;
            if (entry.mode == model::FileMode::Blob)
            {
                head_map[updated_path] = entry.sha;
            }
            else
            {
                walk(entry.sha, updated_path);
            }
        }
    };

    walk(*tree_sha, "");
    return head_map;
}

model::StatusReport Repository::status() const
{
    WorktreeScanner scanner(root_, ignore_rules_);
    const auto worktree = scanner.scan();
    const auto& index_entries = index_.entries();
    const auto head = head_map();

    model::StatusReport report;
    std::set<std::string> all_files;
    for (const auto& [path, _] : worktree)
    {
        all_files.insert(path);
    }
    for (const auto& [path, _] : index_entries)
    {
        all_files.insert(path);
    }
    for (const auto& [path, _] : head)
    {
        all_files.insert(path);
    }

    for (const auto& file_path : all_files)
    {
        const bool in_index = index_.contains(file_path);
        const bool in_worktree = worktree.contains(file_path);
        const bool in_head = head.contains(file_path);

        if (!in_index && in_worktree)
        {
            report.changes.push_back(
                {model::ChangeCategory::Untracked, model::ChangeKind::Untracked, file_path});
        }

        if (in_index && !in_worktree)
        {
            report.changes.push_back(
                {model::ChangeCategory::WorkingDir, model::ChangeKind::Deleted, file_path});
        }

        if (in_index && in_worktree)
        {
            const auto& index_sha = index_entries.at(file_path).sha;
            if (index_sha != worktree.at(file_path))
            {
                report.changes.push_back(
                    {model::ChangeCategory::WorkingDir, model::ChangeKind::Modified, file_path});
            }
        }

        if (!in_head && in_index)
        {
            report.changes.push_back(
                {model::ChangeCategory::Staged, model::ChangeKind::NewFile, file_path});
        }

        if (in_head && !in_index && !in_worktree)
        {
            report.changes.push_back(
                {model::ChangeCategory::Staged, model::ChangeKind::Deleted, file_path});
        }

        if (in_head && in_index && head.at(file_path) != index_entries.at(file_path).sha)
        {
            report.changes.push_back(
                {model::ChangeCategory::Staged, model::ChangeKind::Modified, file_path});
        }
    }

    return report;
}

model::ObjectId Repository::write_tree()
{
    tree::TreeBuilder builder(objects_);
    return builder.build_from_index(index_.entries());
}

model::ObjectId Repository::commit(const std::string& message)
{
    const auto tree_sha = write_tree();
    const auto parent = refs_.head_commit();

    std::ostringstream body;
    body << "tree " << tree_sha.to_string() << '\n';
    body << "parent " << (parent ? parent->to_string() : "null") << '\n';
    body << "author Deepanshu Upadhyay\n";

    const auto now = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
    body << "Date " << std::ctime(&now);
    body << '\n';
    body << message;

    const std::string body_str = body.str();
    const std::vector<std::uint8_t> body_bytes(body_str.begin(), body_str.end());
    const auto raw = objects_.build_raw_object("commit", body_bytes);
    const auto commit_id = objects_.write_object(raw);
    refs_.update_head(commit_id);
    return commit_id;
}

std::string Repository::log() const
{
    const auto head = refs_.head_commit();
    if (!head)
    {
        return "";
    }

    std::vector<std::string> commits_log;
    auto current = *head;

    while (!current.empty())
    {
        const auto commit_obj = objects_.read(current);
        const std::string body(commit_obj.body.begin(), commit_obj.body.end());
        std::istringstream stream(body);
        std::string line;

        std::ostringstream formatted;
        formatted << "commit " << current.to_string() << '\n';

        while (std::getline(stream, line))
        {
            const auto trimmed = line;
            if (trimmed.starts_with("parent") || trimmed.starts_with("tree"))
            {
                continue;
            }
            if (trimmed.starts_with("author "))
            {
                formatted << "Author: " << trimmed.substr(7) << '\n';
            }
            else if (trimmed.starts_with("Date "))
            {
                formatted << "Date:   " << trimmed.substr(5) << '\n';
            }
            else if (trimmed.empty())
            {
                formatted << '\n';
            }
            else
            {
                formatted << "    " << trimmed << '\n';
            }
        }

        commits_log.push_back(formatted.str());

        stream.clear();
        stream.str(body);
        std::optional<model::ObjectId> parent;
        while (std::getline(stream, line))
        {
            if (line.starts_with("parent "))
            {
                const auto parent_str = line.substr(7);
                if (parent_str != "null" && !parent_str.empty())
                {
                    parent = model::ObjectId::from_hex(parent_str);
                }
                break;
            }
        }

        if (!parent)
        {
            break;
        }
        current = *parent;
    }

    std::ostringstream result;
    for (std::size_t i = 0; i < commits_log.size(); ++i)
    {
        result << commits_log[i];
        if (i + 1 < commits_log.size())
        {
            result << '\n';
        }
    }
    return result.str();
}

std::vector<diff::FileDiff> Repository::diff_index_vs_worktree() const
{
    WorktreeScanner scanner(root_, ignore_rules_);
    const auto worktree = scanner.scan();
    const auto& index_entries = index_.entries();

    std::set<std::string> all_files;
    for (const auto& [path, _] : worktree)
    {
        all_files.insert(path);
    }
    for (const auto& [path, _] : index_entries)
    {
        all_files.insert(path);
    }

    std::vector<diff::FileDiff> diffs;

    for (const auto& file_path : all_files)
    {
        const bool in_index = index_.contains(file_path);
        const bool in_worktree = worktree.contains(file_path);

        std::vector<std::string> old_lines;
        std::vector<std::string> new_lines;

        if (in_index && !in_worktree)
        {
            const auto obj = objects_.read(index_entries.at(file_path).sha);
            const std::string content(obj.body.begin(), obj.body.end());
            std::istringstream stream(content);
            std::string line;
            while (std::getline(stream, line))
            {
                old_lines.push_back(line);
            }
            new_lines.clear();
        }
        else if (in_index && in_worktree &&
                 index_entries.at(file_path).sha != worktree.at(file_path))
        {
            const auto obj = objects_.read(index_entries.at(file_path).sha);
            const std::string content(obj.body.begin(), obj.body.end());
            std::istringstream old_stream(content);
            std::string line;
            while (std::getline(old_stream, line))
            {
                old_lines.push_back(line);
            }

            std::ifstream in(root_ / file_path);
            while (std::getline(in, line))
            {
                new_lines.push_back(line);
            }
        }
        else
        {
            continue;
        }

        diffs.push_back({file_path, diff::compute_line_diff(old_lines, new_lines)});
    }

    return diffs;
}

std::vector<model::TreeEntry> Repository::ls_tree(const model::ObjectId& tree_id) const
{
    const auto tree_obj = objects_.read(tree_id);
    return tree::TreeCodec::decode(tree_obj.body);
}

} // namespace minigit::repo

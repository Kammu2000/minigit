#include "minigit/core/repo/worktree_scanner.hpp"
#include "minigit/core/storage/object_store.hpp"
#include "minigit/common/util/paths.hpp"

namespace minigit::repo {

WorktreeScanner::WorktreeScanner(std::filesystem::path root, const IgnoreRules& ignore_rules)
    : root_(std::move(root)), ignore_rules_(ignore_rules)
{
}

std::unordered_map<std::string, model::ObjectId> WorktreeScanner::scan() const
{
    std::unordered_map<std::string, model::ObjectId> result;
    scan_directory(root_, result);
    return result;
}

void WorktreeScanner::scan_directory(const std::filesystem::path& current_dir,
                                     std::unordered_map<std::string, model::ObjectId>& result) const
{
    for (const auto& entry : std::filesystem::directory_iterator(current_dir))
    {
        const auto relative =
            util::normalize_repo_path(std::filesystem::relative(entry.path(), root_));
        if (ignore_rules_.is_ignored(relative))
        {
            continue;
        }

        if (entry.is_directory())
        {
            scan_directory(entry.path(), result);
        }
        else if (entry.is_regular_file())
        {
            storage::ObjectStore store(root_);
            result[relative] = store.hash_file(entry.path(), false);
        }
    }
}

} // namespace minigit::repo

#include <fstream>

#include "minigit/core/repo/refs.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::repo {

Refs::Refs(std::filesystem::path minigit_root) : minigit_root_(std::move(minigit_root)) {}

std::string Refs::head_content() const
{
    const auto head_path = minigit_root_ / "HEAD";
    if (!std::filesystem::exists(head_path))
    {
        return {};
    }

    std::ifstream in(head_path);
    std::string content;
    std::getline(in, content);
    return content;
}

std::optional<model::ObjectId> Refs::head_commit() const
{
    const auto content = head_content();
    if (content.empty())
    {
        return std::nullopt;
    }

    if (content.starts_with("ref:"))
    {
        const auto ref_start = content.find(' ');
        if (ref_start == std::string::npos)
        {
            return std::nullopt;
        }

        const auto ref_path = content.substr(ref_start + 1);
        const auto absolute_ref = minigit_root_ / ref_path;
        if (!std::filesystem::exists(absolute_ref))
        {
            return std::nullopt;
        }

        std::ifstream in(absolute_ref);
        std::string commit_id;
        in >> commit_id;
        if (commit_id.empty())
        {
            return std::nullopt;
        }
        return model::ObjectId::from_hex(commit_id);
    }

    return model::ObjectId::from_hex(content);
}

std::optional<std::string> Refs::current_branch() const
{
    const auto content = head_content();
    if (!content.starts_with("ref:"))
    {
        return std::nullopt;
    }

    const auto ref_start = content.find(' ');
    if (ref_start == std::string::npos)
    {
        return std::nullopt;
    }

    const auto ref_path = content.substr(ref_start + 1);
    const auto slash = ref_path.rfind('/');
    if (slash == std::string::npos)
    {
        return std::nullopt;
    }
    return ref_path.substr(slash + 1);
}

std::vector<std::string> Refs::branches() const
{
    const auto heads_path = minigit_root_ / "refs" / "heads";
    if (!std::filesystem::exists(heads_path))
    {
        throw Error(ErrorCode::PathNotFound,
                    "MINIGIT_PATH_NOT_FOUND_ERROR: .minigit/refs/heads directory "
                    "is missing to track "
                    "branches");
    }

    std::vector<std::string> branches;
    for (const auto& entry : std::filesystem::directory_iterator(heads_path))
    {
        if (entry.is_regular_file())
        {
            branches.push_back(entry.path().filename().string());
        }
    }
    return branches;
}

void Refs::update_head(const model::ObjectId& commit_id)
{
    const auto content = head_content();
    if (content.empty())
    {
        return;
    }

    if (content.starts_with("ref:"))
    {
        const auto ref_start = content.find(' ');
        if (ref_start == std::string::npos)
        {
            return;
        }

        const auto ref_path = content.substr(ref_start + 1);
        const auto absolute_ref = minigit_root_ / ref_path;
        std::filesystem::create_directories(absolute_ref.parent_path());

        std::ofstream out(absolute_ref);
        out << commit_id.to_string();
        return;
    }

    std::ofstream out(minigit_root_ / "HEAD");
    out << commit_id.to_string();
}

} // namespace minigit::repo

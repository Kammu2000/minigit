#include "minigit/common/util/paths.hpp"

namespace minigit::util {

std::string normalize_repo_path(const std::filesystem::path& path)
{
    std::string normalized = path.generic_string();
    if (normalized == ".")
    {
        return "";
    }
    return normalized;
}

} // namespace minigit::util

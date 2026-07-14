#pragma once

#include <filesystem>
#include <string>

namespace minigit::util {

    std::string normalize_repo_path(const std::filesystem::path& path);

} // namespace minigit::util

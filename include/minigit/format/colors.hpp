#pragma once

#include <string>

namespace minigit::format {

namespace colors {
inline constexpr const char* kReset = "\x1b[0m";
inline constexpr const char* kRed = "\x1b[31m";
inline constexpr const char* kGreen = "\x1b[32m";
inline constexpr const char* kBold = "\x1b[1m";
} // namespace colors

std::string red(std::string_view text);
std::string green(std::string_view text);

} // namespace minigit::format

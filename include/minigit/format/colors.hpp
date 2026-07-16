#pragma once

#include <string>
#include <string_view>

namespace minigit::format {
    namespace colors {
        inline constexpr std::string_view kReset = "\x1b[0m";
        inline constexpr std::string_view kRed = "\x1b[31m";
        inline constexpr std::string_view kGreen = "\x1b[32m";
        inline constexpr std::string_view kBold = "\x1b[1m";
    } // namespace colors

    std::string red(std::string_view text);
    std::string green(std::string_view text);

} // namespace minigit::format

#include "minigit/format/colors.hpp"

namespace minigit::format {

std::string red(std::string_view text)
{
    return std::string(colors::kRed) + std::string(text) + colors::kReset;
}

std::string green(std::string_view text)
{
    return std::string(colors::kGreen) + std::string(text) + colors::kReset;
}

} // namespace minigit::format

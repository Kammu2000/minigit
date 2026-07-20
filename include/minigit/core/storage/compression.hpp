#pragma once

#include <span>
#include <vector>

namespace minigit::storage {

    std::vector<std::uint8_t> deflate(std::span<const uint8_t> data);
    std::vector<std::uint8_t> inflate(std::span<const uint8_t> data);

} // namespace minigit::storage

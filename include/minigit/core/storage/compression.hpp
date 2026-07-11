#pragma once

#include <cstdint>
#include <span>
#include <vector>

namespace minigit::storage {

std::vector<std::uint8_t> deflate(std::span<const std::uint8_t> data);
std::vector<std::uint8_t> inflate(std::span<const std::uint8_t> data);

} // namespace minigit::storage

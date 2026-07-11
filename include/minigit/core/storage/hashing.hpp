#pragma once

#include <cstdint>
#include <span>
#include <string>
#include <vector>

namespace minigit::storage {

std::string sha1_hex(std::span<const std::uint8_t> data);
std::vector<std::uint8_t> sha1_bytes(std::span<const std::uint8_t> data);

} // namespace minigit::storage

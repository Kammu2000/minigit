#pragma once

#include <compare>
#include <cstddef>
#include <string>
#include <string_view>

namespace minigit::model {

class ObjectId
{
  public:
    static constexpr std::size_t kHexLength = 40;

    ObjectId() = default;

    explicit ObjectId(std::string hex) : hex_(std::move(hex)) {}

    static ObjectId from_hex(std::string_view hex) { return ObjectId(std::string(hex)); }

    [[nodiscard]] const std::string& to_string() const { return hex_; }
    [[nodiscard]] std::string_view view() const { return hex_; }
    [[nodiscard]] bool empty() const { return hex_.empty(); }

    auto operator<=>(const ObjectId& other) const = default;

  private:
    std::string hex_;
};

} // namespace minigit::model

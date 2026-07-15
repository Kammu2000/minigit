#pragma once

#include <cstddef>
#include <string>
#include <string_view>

namespace minigit::model {

    class ObjectId
    {
      public:
        static constexpr std::size_t kHexLength = 40;

        ObjectId() = default;

        explicit ObjectId(std::string hex) : m_hex(std::move(hex)) {}

        static ObjectId from_hex(std::string_view hex) { return ObjectId(std::string(hex)); }

        [[nodiscard]] const std::string& to_string() const { return m_hex; }
        [[nodiscard]] std::string_view view() const { return m_hex; }
        [[nodiscard]] bool empty() const { return m_hex.empty(); }

        auto operator<=>(const ObjectId& other) const = default;

      private:
        std::string m_hex;
    };

} // namespace minigit::model

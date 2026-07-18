#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <span>
#include <string>
#include <string_view>

namespace minigit::model {

    class ObjectId
    {
      public:
        static constexpr std::size_t kHexLength = 40;
        static constexpr std::size_t kRawSize = 20;

        ObjectId() = default;

        explicit ObjectId(std::string hex);

        static ObjectId from_hex(std::string_view hex);
        static ObjectId from_bytes(std::span<const std::uint8_t> bytes);

        [[nodiscard]] std::array<std::uint8_t, kRawSize> raw_bytes() const;

        [[nodiscard]] const std::string& to_string() const { return m_hex; }
        [[nodiscard]] std::string_view view() const { return m_hex; }
        [[nodiscard]] bool empty() const { return m_hex.empty(); }

        auto operator<=>(const ObjectId& other) const = default;

      private:
        std::string m_hex;
    };

} // namespace minigit::model

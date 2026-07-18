#include "minigit/common/util/error.hpp"
#include "minigit/core/model/object_id.hpp"

namespace minigit::model {

    namespace {

        bool is_hex_digit(const char character)
        {
            return (character >= '0' && character <= '9') ||
                   (character >= 'a' && character <= 'f') || (character >= 'A' && character <= 'F');
        }

        std::uint8_t hex_nibble(const char character)
        {
            if (character >= '0' && character <= '9')
            {
                return static_cast<std::uint8_t>(character - '0');
            }
            if (character >= 'a' && character <= 'f')
            {
                return static_cast<std::uint8_t>(character - 'a' + 10);
            }
            return static_cast<std::uint8_t>(character - 'A' + 10);
        }

        void validate_hex(std::string_view hex)
        {
            if (hex.size() != ObjectId::kHexLength)
            {
                throw Error(ErrorCode::InvalidObjectId,
                            "INVALID_OBJECT_ID_ERROR: object id must be a 40-character hex string");
            }

            for (const char character : hex)
            {
                if (!is_hex_digit(character))
                {
                    throw Error(ErrorCode::InvalidObjectId,
                                "INVALID_OBJECT_ID_ERROR: object id contains invalid hex "
                                "characters");
                }
            }
        }

    } // namespace

    ObjectId::ObjectId(std::string hex) : m_hex(std::move(hex))
    {
        if (!m_hex.empty())
        {
            validate_hex(m_hex);
        }
    }

    ObjectId ObjectId::from_hex(std::string_view hex)
    {
        validate_hex(hex);
        ObjectId id;
        id.m_hex = std::string(hex);
        return id;
    }

    ObjectId ObjectId::from_bytes(std::span<const std::uint8_t> bytes)
    {
        if (bytes.size() != kRawSize)
        {
            throw Error(ErrorCode::InvalidObjectId,
                        "INVALID_OBJECT_ID_ERROR: object id requires 20 raw bytes");
        }

        static constexpr char kHexDigits[] = "0123456789abcdef";
        std::string hex;
        hex.reserve(kHexLength);

        for (const auto byte : bytes)
        {
            hex.push_back(kHexDigits[(byte >> 4) & 0x0f]);
            hex.push_back(kHexDigits[byte & 0x0f]);
        }

        return ObjectId(std::move(hex));
    }

    std::array<std::uint8_t, ObjectId::kRawSize> ObjectId::raw_bytes() const
    {
        validate_hex(m_hex);

        std::array<std::uint8_t, kRawSize> bytes{};
        for (std::size_t i = 0; i < kRawSize; ++i)
        {
            const auto high = hex_nibble(m_hex[i * 2]);
            const auto low = hex_nibble(m_hex[i * 2 + 1]);
            bytes[i] = static_cast<std::uint8_t>((high << 4) | low);
        }

        return bytes;
    }

} // namespace minigit::model

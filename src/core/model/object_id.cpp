#include "minigit/common/util/error.hpp"
#include "minigit/core/model/object_id.hpp"

namespace minigit::model {

    namespace {

        bool is_hex_digit(const char character)
        {
            return (character >= '0' && character <= '9') ||
                   (character >= 'a' && character <= 'f') || (character >= 'A' && character <= 'F');
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

} // namespace minigit::model

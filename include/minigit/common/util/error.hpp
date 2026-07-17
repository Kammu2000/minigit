#pragma once

#include <cstdint>
#include <stdexcept>
#include <string>

namespace minigit {

    enum class ErrorCode : std::uint8_t
    {
        RepoAlreadyExists,
        RepoNotFound,
        PathNotFound,
        InvalidCommand,
        ObjectNotFound,
        ObjectCorrupted,
        InvalidObjectId,
        FileNotFound,
    };

    class Error : public std::runtime_error
    {
      public:
        Error(ErrorCode code, std::string message)
            : std::runtime_error(std::move(message)), m_code(code)
        {
        }

        [[nodiscard]] ErrorCode code() const { return m_code; }

      private:
        ErrorCode m_code;
    };

} // namespace minigit

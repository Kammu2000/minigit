#pragma once

#include <stdexcept>
#include <string>

namespace minigit {

enum class ErrorCode
{
    RepoAlreadyExists,
    RepoNotFound,
    PathNotFound,
    InvalidCommand,
    ObjectNotFound,
    ObjectCorrupted,
    FileNotFound,
};

class Error : public std::runtime_error
{
  public:
    Error(ErrorCode code, std::string message) : std::runtime_error(std::move(message)), code_(code)
    {
    }

    [[nodiscard]] ErrorCode code() const { return code_; }

  private:
    ErrorCode code_;
};

} // namespace minigit

#pragma once

#include <span>
#include <string_view>

#include "minigit/core/repo/repository.hpp"

namespace minigit::cli {

    class Command
    {
      public:
        virtual ~Command() = default;

        /// Executes the command. `repo` must be non-null for every command except "init"
        /// (enforced via `precondition_` in each concrete command's `execute`).
        virtual int execute(repo::Repository* repo,
                            std::span<const std::string_view> args) const = 0;
    };

} // namespace minigit::cli

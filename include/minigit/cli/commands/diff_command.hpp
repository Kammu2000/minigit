#pragma once

#include "minigit/cli/command.hpp"

namespace minigit::cli {

    class DiffCommand : public Command
    {
      public:
        int execute(repo::Repository* repo, std::span<const std::string_view> args) const override;
    };

} // namespace minigit::cli

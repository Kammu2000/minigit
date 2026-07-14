#include <print>

#include "minigit/cli/commands/write_tree_command.hpp"

namespace minigit::cli {

    int WriteTreeCommand::execute(repo::Repository* repo,
                                  [[maybe_unused]] std::span<const std::string_view> args) const
    {
        std::println("{}", repo->write_tree().to_string());
        return 0;
    }

} // namespace minigit::cli

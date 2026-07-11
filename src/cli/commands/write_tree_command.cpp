#include <iostream>

#include "minigit/cli/commands/write_tree_command.hpp"

namespace minigit::cli {

int WriteTreeCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    (void)args;
    std::cout << repo->write_tree().to_string() << '\n';
    return 0;
}

} // namespace minigit::cli

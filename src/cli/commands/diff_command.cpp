#include <iostream>

#include "minigit/cli/commands/diff_command.hpp"
#include "minigit/format/output.hpp"

namespace minigit::cli {

int DiffCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    (void)args;
    format::print_diff(std::cout, repo->diff_index_vs_worktree());
    return 0;
}

} // namespace minigit::cli

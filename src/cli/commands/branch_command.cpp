#include <iostream>

#include "minigit/cli/commands/branch_command.hpp"
#include "minigit/format/output.hpp"

namespace minigit::cli {

int BranchCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    (void)args;
    const auto branches = repo->refs().branches();
    const auto current = repo->refs().current_branch();
    format::print_branches(std::cout, branches, current);
    return 0;
}

} // namespace minigit::cli

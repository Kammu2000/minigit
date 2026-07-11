#include <iostream>

#include "minigit/cli/commands/status_command.hpp"
#include "minigit/format/output.hpp"

namespace minigit::cli {

int StatusCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    (void)args;
    format::print_status(std::cout, repo->status());
    return 0;
}

} // namespace minigit::cli

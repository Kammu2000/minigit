#include <print>

#include "minigit/cli/commands/commit_command.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

    int CommitCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
    {
        if (args.size() < 2 || args[0] != "-m")
        {
            throw Error(
                ErrorCode::InvalidCommand,
                "INVALID_COMMAND_ERROR: please provide -m flag along with commit message to "
                "commit your changes");
        }

        const auto commit_id = repo->commit(std::string(args[1]));
        std::println("Committed changes with commit Id: ", commit_id.to_string());
        return 0;
    }

} // namespace minigit::cli

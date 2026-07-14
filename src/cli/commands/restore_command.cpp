#include "minigit/cli/commands/restore_command.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

    int RestoreCommand::execute(repo::Repository* repo,
                                std::span<const std::string_view> args) const
    {
        if (args.empty())
        {
            throw Error(ErrorCode::InvalidCommand,
                        "INVALID_COMMAND_ERROR: please pass a file path in command arguments");
        }

        repo->unstage(std::string(args[0]));
        return 0;
    }

} // namespace minigit::cli

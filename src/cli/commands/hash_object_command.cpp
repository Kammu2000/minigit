#include <print>

#include "minigit/cli/commands/hash_object_command.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

    int HashObjectCommand::execute(repo::Repository* repo,
                                   std::span<const std::string_view> args) const
    {
        if (args.empty())
        {
            throw Error(ErrorCode::InvalidCommand,
                        "INVALID_COMMAND_ERROR: please pass a file path in command arguments");
        }

        std::string file_path = std::string(args[0]);
        bool write = false;

        if (args[0] == "-w")
        {
            if (args.size() < 2)
            {
                throw Error(ErrorCode::InvalidCommand,
                            "INVALID_COMMAND_ERROR: please pass a file path in command arguments");
            }
            write = true;
            file_path = std::string(args[1]);
        }

        const auto hash_id = repo->objects().hash_file(file_path, write);
        std::println("{}", hash_id.to_string());
        return 0;
    }

} // namespace minigit::cli

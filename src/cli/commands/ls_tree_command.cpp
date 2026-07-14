#include <iostream>

#include "minigit/cli/commands/ls_tree_command.hpp"
#include "minigit/format/output.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

    int LsTreeCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
    {
        if (args.empty())
        {
            throw Error(ErrorCode::InvalidCommand,
                        "INVALID_COMMAND_ERROR: sha was not passed in command arguments");
        }

        const auto entries = repo->ls_tree(model::ObjectId::from_hex(args[0]));
        format::print_tree(std::cout, entries);
        return 0;
    }

} // namespace minigit::cli

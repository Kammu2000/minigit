#include <iostream>

#include "minigit/cli/commands/cat_file_command.hpp"
#include "minigit/format/output.hpp"
#include "minigit/core/model/object_type.hpp"
#include "minigit/core/tree/tree_builder.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

int CatFileCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    if (args.size() < 2)
    {
        const std::string message = args.empty() ? "Flag was not passed to the command"
                                                 : "Object sha was not passed to the command";
        throw Error(ErrorCode::InvalidCommand, "INVALID_COMMAND_ERROR: " + message);
    }

    const auto flag = args[0];
    const auto hash_id = model::ObjectId::from_hex(args[1]);
    const auto object = repo->objects().read(hash_id);

    if (flag == "-t")
    {
        std::cout << model::to_string(object.type) << '\n';
        return 0;
    }

    if (flag == "-p")
    {
        switch (object.type)
        {
            case model::ObjectType::Blob: {
                std::cout << std::string(object.body.begin(), object.body.end()) << '\n';
                return 0;
            }
            case model::ObjectType::Tree: {
                const auto entries = tree::TreeCodec::decode(object.body);
                format::print_tree(std::cout, entries);
                return 0;
            }
            case model::ObjectType::Commit: {
                std::cout << std::string(object.body.begin(), object.body.end()) << '\n';
                return 0;
            }
        }
        throw Error(ErrorCode::ObjectCorrupted,
                    "OBJECT_CORRUPTED_ERROR: object with " + hash_id.to_string() + " is corrupted");
    }

    throw Error(ErrorCode::InvalidCommand,
                "INVALID_COMMAND_ERROR: " + std::string(flag) + " flag does not exist on command");
}

} // namespace minigit::cli

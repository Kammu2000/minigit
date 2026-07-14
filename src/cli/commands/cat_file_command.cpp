#include <format>
#include <iostream>
#include <print>

#include "minigit/cli/commands/cat_file_command.hpp"
#include "minigit/format/output.hpp"
#include "minigit/core/model/object_type.hpp"
#include "minigit/core/tree/tree_builder.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

    int CatFileCommand::execute(repo::Repository* repo,
                                std::span<const std::string_view> args) const
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
            std::println("{}", model::to_string(object.type));
            return 0;
        }

        if (flag == "-p")
        {
            switch (object.type)
            {
                case model::ObjectType::Blob:
                case model::ObjectType::Commit: {
                    std::println("{}", std::string(object.body.begin(), object.body.end()));
                    return 0;
                }

                case model::ObjectType::Tree: {
                    const auto entries = tree::TreeCodec::decode(object.body);
                    format::print_tree(std::cout, entries);
                    return 0;
                }
            }

            throw Error(ErrorCode::ObjectCorrupted,
                        std::format("OBJECT_CORRUPTED_ERROR: object with hashId - {} is corrupted",
                                    hash_id.to_string()));
        }

        throw Error(ErrorCode::InvalidCommand,
                    std::format("INVALID_COMMAND_ERROR: {} flag does not exist on command", flag));
    }

} // namespace minigit::cli

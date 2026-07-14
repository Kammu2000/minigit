#include <string>
#include <vector>

#include "minigit/cli/commands/add_command.hpp"

namespace minigit::cli {

    int AddCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
    {
        std::vector<std::string> paths;
        paths.reserve(args.size());

        for (const auto arg : args)
        {
            paths.emplace_back(arg);
        }

        repo->stage(paths);
        return 0;
    }

} // namespace minigit::cli

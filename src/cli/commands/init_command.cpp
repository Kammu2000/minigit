#include <print>

#include "minigit/cli/commands/init_command.hpp"
#include "minigit/core/repo/repository.hpp"

namespace minigit::cli {

    int InitCommand::execute([[maybe_unused]] repo::Repository* repo,
                             [[maybe_unused]] std::span<const std::string_view> args) const
    {
        (void)repo::Repository::init(std::filesystem::current_path());
        std::println("Initialized empty minigit repository");
        return 0;
    }

} // namespace minigit::cli

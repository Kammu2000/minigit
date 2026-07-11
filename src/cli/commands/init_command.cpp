#include <iostream>

#include "minigit/cli/commands/init_command.hpp"
#include "minigit/core/repo/repository.hpp"

namespace minigit::cli {

int InitCommand::execute(repo::Repository* repo, std::span<const std::string_view> args) const
{
    (void)repo;
    (void)args;
    (void)repo::Repository::init(std::filesystem::current_path());
    std::cout << "Initialized empty minigit repository";
    return 0;
}

} // namespace minigit::cli

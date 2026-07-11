#include "minigit/cli/registry.hpp"
#include "minigit/cli/commands/add_command.hpp"
#include "minigit/cli/commands/branch_command.hpp"
#include "minigit/cli/commands/cat_file_command.hpp"
#include "minigit/cli/commands/commit_command.hpp"
#include "minigit/cli/commands/diff_command.hpp"
#include "minigit/cli/commands/hash_object_command.hpp"
#include "minigit/cli/commands/init_command.hpp"
#include "minigit/cli/commands/log_command.hpp"
#include "minigit/cli/commands/ls_tree_command.hpp"
#include "minigit/cli/commands/restore_command.hpp"
#include "minigit/cli/commands/status_command.hpp"
#include "minigit/cli/commands/write_tree_command.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::cli {

CommandRegistry::CommandRegistry()
{
    register_command("init", std::make_unique<InitCommand>());
    register_command("hash-object", std::make_unique<HashObjectCommand>());
    register_command("cat-file", std::make_unique<CatFileCommand>());
    register_command("write-tree", std::make_unique<WriteTreeCommand>());
    register_command("ls-tree", std::make_unique<LsTreeCommand>());
    register_command("add", std::make_unique<AddCommand>());
    register_command("restore", std::make_unique<RestoreCommand>());
    register_command("status", std::make_unique<StatusCommand>());
    register_command("commit", std::make_unique<CommitCommand>());
    register_command("log", std::make_unique<LogCommand>());
    register_command("branch", std::make_unique<BranchCommand>());
    register_command("diff", std::make_unique<DiffCommand>());
}

void CommandRegistry::register_command(std::string_view name, std::unique_ptr<Command> command)
{
    commands_.emplace(std::string(name), std::move(command));
}

const Command& CommandRegistry::get(std::string_view name) const
{
    const auto it = commands_.find(std::string(name));
    if (it == commands_.end())
    {
        throw Error(ErrorCode::InvalidCommand,
                    "INVALID_COMMAND_ERROR: unknown command: " + std::string(name));
    }
    return *it->second;
}

} // namespace minigit::cli

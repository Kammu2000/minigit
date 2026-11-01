#include "minigit/cli/commands/log_command.hpp"
#include "minigit/common/util/assert.hpp"
#include "minigit/format/output.hpp"

namespace minigit::cli {

    int LogCommand::execute(repo::Repository* repo,
                            [[maybe_unused]] std::span<const std::string_view> args) const
    {
        precondition_(repo != nullptr, "log command requires an open repository");

        format::print_log_pager(repo->log());
        return 0;
    }

} // namespace minigit::cli

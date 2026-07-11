#pragma once

#include <memory>
#include <string>
#include <string_view>
#include <unordered_map>

#include "minigit/cli/command.hpp"

namespace minigit::cli {

class CommandRegistry
{
  public:
    CommandRegistry();

    [[nodiscard]] const Command& get(std::string_view name) const;

  private:
    void register_command(std::string_view name, std::unique_ptr<Command> command);

    std::unordered_map<std::string, std::unique_ptr<Command>> commands_;
};

} // namespace minigit::cli

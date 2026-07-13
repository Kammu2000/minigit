#pragma once

#include <string>
#include <vector>

namespace minigit::cli {

struct ParsedCli
{
    std::string command;
    std::vector<std::string> args;
};

[[nodiscard]] ParsedCli parse(int argc, char* argv[]);

} // namespace minigit::cli

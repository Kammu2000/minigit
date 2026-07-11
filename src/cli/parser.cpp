#include <iostream>

#include "minigit/cli/parser.hpp"
#include "minigit/format/output.hpp"

namespace minigit::cli {

ParsedCli parse(int argc, char* argv[])
{
    if (argc < 2)
    {
        format::print_error(std::cerr, "No command specified");
        std::exit(1);
    }

    ParsedCli parsed;
    parsed.command = argv[1];
    for (int i = 2; i < argc; ++i)
    {
        parsed.args.emplace_back(argv[i]);
    }
    return parsed;
}

} // namespace minigit::cli

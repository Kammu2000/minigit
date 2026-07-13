#include <iostream>

#include "minigit/cli/parser.hpp"
#include "minigit/cli/registry.hpp"
#include "minigit/common/util/error.hpp"
#include "minigit/core/repo/repository.hpp"
#include "minigit/format/output.hpp"

int main(int argc, char* argv[])
{
    try
    {
        const auto parsed = minigit::cli::parse(argc, argv);
        const minigit::cli::CommandRegistry registry;

        std::vector<std::string_view> arg_views;
        arg_views.reserve(parsed.args.size());

        for (const auto& arg : parsed.args)
        {
            arg_views.push_back(arg);
        }

        if (parsed.command == "init")
        {
            return registry.get("init").execute(nullptr, arg_views);
        }

        auto repo = minigit::repo::Repository::open(std::filesystem::current_path());
        return registry.get(parsed.command).execute(&repo, arg_views);
    }
    catch (const minigit::Error& error)
    {
        minigit::format::print_error(std::cerr, error.what());
        return 1;
    }
    catch (const std::exception& error)
    {
        minigit::format::print_error(std::cerr, std::string("[INTERNAL-ERROR]: ") + error.what());
        return 1;
    }
}

#include <fstream>

#include "minigit/core/repo/ignore_rules.hpp"

namespace minigit::repo {

IgnoreRules::IgnoreRules(std::filesystem::path root)
{
    const auto ignore_file = root / ".minigitIgnore";
    std::ifstream in(ignore_file);
    std::string line;
    while (std::getline(in, line))
    {
        const auto trimmed = line;
        if (trimmed.empty() || trimmed.starts_with('#'))
        {
            continue;
        }
        patterns_.push_back(trimmed);
    }
    patterns_.push_back(".minigit/");
}

bool IgnoreRules::is_ignored(const std::string& relative_path) const
{
    for (const auto& pattern : patterns_)
    {
        if (pattern.ends_with('/'))
        {
            const auto dir = pattern.substr(0, pattern.size() - 1);
            if (relative_path.starts_with(dir))
            {
                return true;
            }
        }
        else if (pattern.starts_with("*."))
        {
            if (relative_path.ends_with(pattern.substr(1)))
            {
                return true;
            }
        }
        else if (relative_path == pattern)
        {
            return true;
        }
    }
    return false;
}

} // namespace minigit::repo

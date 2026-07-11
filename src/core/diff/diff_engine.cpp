#include <algorithm>

#include "minigit/core/diff/diff_engine.hpp"

namespace minigit::diff {

std::vector<LineEdit> compute_line_diff(const std::vector<std::string>& old_lines,
                                        const std::vector<std::string>& new_lines)
{
    const int m = static_cast<int>(old_lines.size());
    const int n = static_cast<int>(new_lines.size());

    std::vector<std::vector<int>> dp(static_cast<std::size_t>(m + 1),
                                     std::vector<int>(static_cast<std::size_t>(n + 1), 0));

    for (int i = 1; i <= m; ++i)
    {
        for (int j = 1; j <= n; ++j)
        {
            if (old_lines[static_cast<std::size_t>(i - 1)] ==
                new_lines[static_cast<std::size_t>(j - 1)])
            {
                dp[static_cast<std::size_t>(i)][static_cast<std::size_t>(j)] =
                    dp[static_cast<std::size_t>(i - 1)][static_cast<std::size_t>(j - 1)] + 1;
            }
            else
            {
                dp[static_cast<std::size_t>(i)][static_cast<std::size_t>(j)] =
                    std::max(dp[static_cast<std::size_t>(i - 1)][static_cast<std::size_t>(j)],
                             dp[static_cast<std::size_t>(i)][static_cast<std::size_t>(j - 1)]);
            }
        }
    }

    std::vector<LineEdit> edits;
    int i = m;
    int j = n;

    while (i >= 1 && j >= 1)
    {
        if (old_lines[static_cast<std::size_t>(i - 1)] ==
            new_lines[static_cast<std::size_t>(j - 1)])
        {
            edits.push_back(LineEdit{EditType::Equal, old_lines[static_cast<std::size_t>(i - 1)],
                                     LinePosition{i, j}});
            --i;
            --j;
        }
        else if (dp[static_cast<std::size_t>(i - 1)][static_cast<std::size_t>(j)] >=
                 dp[static_cast<std::size_t>(i)][static_cast<std::size_t>(j - 1)])
        {
            edits.push_back(LineEdit{EditType::Deleted, old_lines[static_cast<std::size_t>(i - 1)],
                                     LinePosition{i, std::nullopt}});
            --i;
        }
        else
        {
            edits.push_back(LineEdit{EditType::Inserted, new_lines[static_cast<std::size_t>(j - 1)],
                                     LinePosition{std::nullopt, j}});
            --j;
        }
    }

    while (i >= 1)
    {
        edits.push_back(LineEdit{EditType::Deleted, old_lines[static_cast<std::size_t>(i - 1)],
                                 LinePosition{i, std::nullopt}});
        --i;
    }

    while (j >= 1)
    {
        edits.push_back(LineEdit{EditType::Inserted, new_lines[static_cast<std::size_t>(j - 1)],
                                 LinePosition{std::nullopt, j}});
        --j;
    }

    std::reverse(edits.begin(), edits.end());
    return edits;
}

} // namespace minigit::diff

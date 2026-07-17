#include <algorithm>

#include "minigit/core/diff/diff_engine.hpp"

namespace minigit::diff {

    std::vector<LineEdit> compute_line_diff(const std::vector<std::string>& old_lines,
                                            const std::vector<std::string>& new_lines)
    {
        const std::size_t m = old_lines.size();
        const std::size_t n = new_lines.size();

        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

        for (std::size_t i = 1; i <= m; ++i)
        {
            for (std::size_t j = 1; j <= n; ++j)
            {
                if (old_lines[i - 1] == new_lines[j - 1])
                {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                else
                {
                    dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        std::vector<LineEdit> edits;
        std::size_t i = m;
        std::size_t j = n;

        while (i > 0 && j > 0)
        {
            if (old_lines[i - 1] == new_lines[j - 1])
            {
                edits.push_back(LineEdit{EditType::Equal, old_lines[i - 1], LinePosition{i, j}});
                --i;
                --j;
            }
            else if (dp[i - 1][j] >= dp[i][j - 1])
            {
                edits.push_back(
                    LineEdit{EditType::Deleted, old_lines[i - 1], LinePosition{i, std::nullopt}});
                --i;
            }
            else
            {
                edits.push_back(
                    LineEdit{EditType::Inserted, new_lines[j - 1], LinePosition{std::nullopt, j}});
                --j;
            }
        }

        while (i > 0)
        {
            edits.push_back(
                LineEdit{EditType::Deleted, old_lines[i - 1], LinePosition{i, std::nullopt}});
            --i;
        }

        while (j > 0)
        {
            edits.push_back(
                LineEdit{EditType::Inserted, new_lines[j - 1], LinePosition{std::nullopt, j}});
            --j;
        }

        std::reverse(edits.begin(), edits.end());
        return edits;
    }

} // namespace minigit::diff

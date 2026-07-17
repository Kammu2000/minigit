#pragma once

#include <cstddef>
#include <optional>
#include <string>
#include <vector>

namespace minigit::diff {

    struct LinePosition
    {
        std::optional<std::size_t> old_line;
        std::optional<std::size_t> new_line;
    };

    enum class EditType
    {
        Equal,
        Inserted,
        Deleted
    };

    struct LineEdit
    {
        EditType type = EditType::Equal;
        std::string content;
        LinePosition position;
    };

    struct FileDiff
    {
        std::string file_path;
        std::vector<LineEdit> edits;
    };

    std::vector<LineEdit> compute_line_diff(const std::vector<std::string>& old_lines,
                                            const std::vector<std::string>& new_lines);

} // namespace minigit::diff

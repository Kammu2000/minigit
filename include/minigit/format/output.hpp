#pragma once

#include "minigit/core/diff/diff_engine.hpp"
#include "minigit/core/model/status.hpp"
#include "minigit/core/model/tree_entry.hpp"

#include <iosfwd>
#include <optional>
#include <string>
#include <string_view>
#include <vector>

namespace minigit::format {

void print_status(std::ostream& out, const model::StatusReport& report);
void print_tree(std::ostream& out, const std::vector<model::TreeEntry>& entries);
void print_diff(std::ostream& out, const std::vector<diff::FileDiff>& diffs);
void print_branches(std::ostream& out, const std::vector<std::string>& branches,
                    std::optional<std::string_view> current);
void print_error(std::ostream& out, std::string_view message);
void print_log_pager(std::string_view log_text);

} // namespace minigit::format

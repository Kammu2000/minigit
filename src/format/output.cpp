#include <cstdio>
#include <iostream>

#include "minigit/format/colors.hpp"
#include "minigit/format/output.hpp"
#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/model/status.hpp"

namespace minigit::format {

namespace {

std::string change_kind_label(model::ChangeKind kind)
{
    switch (kind)
    {
        case model::ChangeKind::NewFile:
            return "newFile";
        case model::ChangeKind::Deleted:
            return "deleted";
        case model::ChangeKind::Modified:
            return "modified";
        case model::ChangeKind::Untracked:
            return "";
    }
    return "";
}

} // namespace

void print_status(std::ostream& out, const model::StatusReport& report)
{
    auto print_section = [&](model::ChangeCategory category, std::string_view title,
                             bool use_green) {
        bool printed_header = false;
        for (const auto& change : report.changes)
        {
            if (change.category != category)
            {
                continue;
            }
            if (!printed_header)
            {
                out << title << '\n';
                printed_header = true;
            }

            const auto label = change_kind_label(change.kind);
            const std::string line = label.empty() ? change.path : label + ": " + change.path;
            out << '\n' << (use_green ? green(line) : red(line)) << '\n';
        }
        if (printed_header)
        {
            out << '\n';
        }
    };

    print_section(model::ChangeCategory::WorkingDir, "Changes not staged for commit: ", false);
    print_section(model::ChangeCategory::Staged, "Changes to be committed: ", true);
    print_section(model::ChangeCategory::Untracked, "Untracked files: ", false);
}

void print_tree(std::ostream& out, const std::vector<model::TreeEntry>& entries)
{
    for (const auto& entry : entries)
    {
        const auto type = entry.mode == model::FileMode::Blob ? "BLOB" : "TREE";
        out << model::to_string(entry.mode) << ' ' << type << ' ' << entry.sha.to_string() << ' '
            << entry.name;
    }
}

void print_diff(std::ostream& out, const std::vector<diff::FileDiff>& diffs)
{
    for (const auto& file_diff : diffs)
    {
        out << colors::kBold << "diff --git a/" << file_diff.file_path << " b/"
            << file_diff.file_path << colors::kReset << '\n';
        out << red("--- a/" + file_diff.file_path) << '\n';
        out << green("+++ b/" + file_diff.file_path) << '\n';
        out << '\n';

        for (const auto& edit : file_diff.edits)
        {
            switch (edit.type)
            {
                case diff::EditType::Equal:
                    out << ' ' << edit.content << '\n';
                    break;
                case diff::EditType::Deleted:
                    out << red("-" + edit.content) << '\n';
                    break;
                case diff::EditType::Inserted:
                    out << green("+" + edit.content) << '\n';
                    break;
            }
        }
    }
}

void print_branches(std::ostream& out, const std::vector<std::string>& branches,
                    std::optional<std::string_view> current)
{
    for (const auto& branch : branches)
    {
        if (current && branch == *current)
        {
            out << green("* " + branch) << '\n';
        }
        else
        {
            out << branch << '\n';
        }
    }
}

void print_error(std::ostream& out, std::string_view message)
{
    out << message << '\n';
}

void print_log_pager(std::string_view log_text)
{
    FILE* pipe = popen("less -R", "w");
    if (!pipe)
    {
        return;
    }
    fwrite(log_text.data(), 1, log_text.size(), pipe);
    pclose(pipe);
}

} // namespace minigit::format

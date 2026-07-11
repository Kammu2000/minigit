#pragma once

#include <string>
#include <vector>

namespace minigit::model {

enum class ChangeCategory
{
    WorkingDir,
    Staged,
    Untracked
};

enum class ChangeKind
{
    NewFile,
    Deleted,
    Modified,
    Untracked
};

struct FileChange
{
    ChangeCategory category = ChangeCategory::Untracked;
    ChangeKind kind = ChangeKind::Untracked;
    std::string path;
};

struct StatusReport
{
    std::vector<FileChange> changes;
};

} // namespace minigit::model

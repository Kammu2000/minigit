#include "minigit/common/util/paths.hpp"
#include "minigit/core/repo/worktree_scanner.hpp"
#include "minigit/core/storage/object_store.hpp"

namespace minigit::repo {

    WorktreeScanner::WorktreeScanner(std::filesystem::path root, const IgnoreRules& ignore_rules)
        : m_root(std::move(root)), m_ignore_rules(ignore_rules)
    {
    }

    std::unordered_map<std::string, model::ObjectId> WorktreeScanner::scan() const
    {
        std::unordered_map<std::string, model::ObjectId> result;
        scan_directory(m_root, result);
        return result;
    }

    void
    WorktreeScanner::scan_directory(const std::filesystem::path& current_dir,
                                    std::unordered_map<std::string, model::ObjectId>& result) const
    {
        for (const auto& entry : std::filesystem::directory_iterator(current_dir))
        {
            const auto relative =
                util::normalize_repo_path(std::filesystem::relative(entry.path(), m_root));
            if (m_ignore_rules.is_ignored(relative))
            {
                continue;
            }

            if (entry.is_directory())
            {
                scan_directory(entry.path(), result);
            }
            else if (entry.is_regular_file())
            {
                storage::ObjectStore store(m_root);
                result[relative] = store.hash_file(entry.path(), false);
            }
        }
    }

} // namespace minigit::repo

#pragma once

#include <filesystem>
#include <string>
#include <unordered_map>
#include <vector>

#include "minigit/core/model/object_id.hpp"
#include "minigit/core/model/status.hpp"
#include "minigit/core/model/tree_entry.hpp"
#include "minigit/core/repo/ignore_rules.hpp"
#include "minigit/core/repo/index.hpp"
#include "minigit/core/repo/refs.hpp"
#include "minigit/core/storage/object_store.hpp"

namespace minigit::diff {
struct FileDiff;
}

namespace minigit::repo {

class Repository
{
  public:
    [[nodiscard]] static Repository init(const std::filesystem::path& root);
    [[nodiscard]] static Repository open(const std::filesystem::path& root);

    void stage(const std::vector<std::string>& paths);
    void unstage(const std::string& path);

    [[nodiscard]] model::StatusReport status() const;
    [[nodiscard]] model::ObjectId write_tree();
    [[nodiscard]] model::ObjectId commit(const std::string& message);
    [[nodiscard]] std::string log() const;
    [[nodiscard]] std::vector<diff::FileDiff> diff_index_vs_worktree() const;
    [[nodiscard]] std::vector<model::TreeEntry> ls_tree(const model::ObjectId& tree_id) const;

    [[nodiscard]] const std::filesystem::path& root() const { return m_root; }
    [[nodiscard]] storage::ObjectStore& objects() { return m_objects; }
    [[nodiscard]] const storage::ObjectStore& objects() const { return m_objects; }
    [[nodiscard]] Index& index() { return m_index; }
    [[nodiscard]] const Index& index() const { return m_index; }
    [[nodiscard]] Refs& refs() { return m_refs; }
    [[nodiscard]] const Refs& refs() const { return m_refs; }
    [[nodiscard]] const IgnoreRules& ignore_rules() const { return m_ignore_rules; }

  private:
    Repository(std::filesystem::path root, storage::ObjectStore objects, Index index, Refs refs,
               IgnoreRules ignore_rules);

    std::filesystem::path m_root;
    storage::ObjectStore m_objects;
    Index m_index;
    Refs m_refs;
    IgnoreRules m_ignore_rules;

    [[nodiscard]] std::unordered_map<std::string, model::ObjectId> head_map() const;
};

} // namespace minigit::repo

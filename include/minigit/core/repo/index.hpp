#pragma once

#include "minigit/core/model/object_id.hpp"
#include "minigit/core/model/staged_entry.hpp"

#include <filesystem>
#include <string>
#include <unordered_map>

namespace minigit::repo {

class Index
{
  public:
    explicit Index(std::filesystem::path index_path);

    void load();
    void save() const;

    void stage(const std::string& path, const model::StagedEntry& entry);
    void unstage(const std::string& path);

    [[nodiscard]] bool contains(const std::string& path) const;
    [[nodiscard]] const model::StagedEntry* find(const std::string& path) const;
    [[nodiscard]] const std::unordered_map<std::string, model::StagedEntry>& entries() const
    {
        return m_entries;
    }

  private:
    std::filesystem::path m_index_path;
    std::unordered_map<std::string, model::StagedEntry> m_entries;
};

} // namespace minigit::repo

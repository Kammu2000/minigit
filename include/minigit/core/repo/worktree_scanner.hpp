#pragma once

#include "minigit/core/model/object_id.hpp"
#include "minigit/core/repo/ignore_rules.hpp"

#include <filesystem>
#include <string>
#include <unordered_map>

namespace minigit::repo {

class WorktreeScanner
{
  public:
    WorktreeScanner(std::filesystem::path root, const IgnoreRules& ignore_rules);

    [[nodiscard]] std::unordered_map<std::string, model::ObjectId> scan() const;

  private:
    std::filesystem::path m_root;
    const IgnoreRules& m_ignore_rules;

    void scan_directory(const std::filesystem::path& current_dir,
                        std::unordered_map<std::string, model::ObjectId>& result) const;
};

} // namespace minigit::repo

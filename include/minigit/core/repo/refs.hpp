#pragma once

#include "minigit/core/model/object_id.hpp"

#include <filesystem>
#include <optional>
#include <string>
#include <vector>

namespace minigit::repo {

class Refs
{
  public:
    explicit Refs(std::filesystem::path minigit_root);

    [[nodiscard]] std::optional<model::ObjectId> head_commit() const;
    [[nodiscard]] std::optional<std::string> current_branch() const;
    [[nodiscard]] std::vector<std::string> branches() const;
    void update_head(const model::ObjectId& commit_id);

  private:
    std::filesystem::path minigit_root_;
    [[nodiscard]] std::string head_content() const;
};

} // namespace minigit::repo

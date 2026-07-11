#pragma once

#include <filesystem>
#include <string>
#include <vector>

namespace minigit::repo {

class IgnoreRules
{
  public:
    explicit IgnoreRules(std::filesystem::path root);

    [[nodiscard]] bool is_ignored(const std::string& relative_path) const;
    [[nodiscard]] const std::vector<std::string>& patterns() const { return patterns_; }

  private:
    std::vector<std::string> patterns_;
};

} // namespace minigit::repo

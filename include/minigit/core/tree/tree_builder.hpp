#pragma once

#include "minigit/core/model/staged_entry.hpp"
#include "minigit/core/model/tree_entry.hpp"
#include "minigit/core/storage/object_store.hpp"

#include <cstdint>
#include <span>
#include <string>
#include <unordered_map>
#include <vector>

namespace minigit::tree {

class TreeCodec
{
  public:
    static std::vector<std::uint8_t> encode(const std::vector<model::TreeEntry>& entries);
    static std::vector<model::TreeEntry> decode(std::span<const std::uint8_t> body);
};

class TreeBuilder
{
  public:
    explicit TreeBuilder(storage::ObjectStore& store);

    [[nodiscard]] model::ObjectId
    build_from_index(const std::unordered_map<std::string, model::StagedEntry>& entries);

  private:
    storage::ObjectStore& m_store;

    struct TreeNode
    {
        std::string name;
        bool is_blob = false;
        model::ObjectId hash_id;
        std::vector<TreeNode> children;
    };

    [[nodiscard]] model::ObjectId hash_tree(TreeNode& node);
};

} // namespace minigit::tree

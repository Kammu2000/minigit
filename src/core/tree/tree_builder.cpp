#include <algorithm>
#include <iomanip>
#include <sstream>

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/tree/tree_builder.hpp"

namespace minigit::tree {

std::vector<std::uint8_t> TreeCodec::encode(const std::vector<model::TreeEntry>& entries)
{
    std::vector<std::uint8_t> body;
    for (const auto& entry : entries)
    {
        const std::string header =
            std::string(model::to_string(entry.mode)) + ' ' + entry.name + '\0';
        body.insert(body.end(), header.begin(), header.end());

        std::vector<std::uint8_t> raw_sha;
        raw_sha.reserve(20);
        for (std::size_t i = 0; i < 40; i += 2)
        {
            const auto byte = std::stoi(std::string(entry.sha.view().substr(i, 2)), nullptr, 16);
            raw_sha.push_back(static_cast<std::uint8_t>(byte));
        }
        body.insert(body.end(), raw_sha.begin(), raw_sha.end());
    }

    std::ostringstream header;
    header << "tree " << body.size() << '\0';
    const std::string header_str = header.str();

    std::vector<std::uint8_t> raw;
    raw.insert(raw.end(), header_str.begin(), header_str.end());
    raw.insert(raw.end(), body.begin(), body.end());
    return raw;
}

std::vector<model::TreeEntry> TreeCodec::decode(std::span<const std::uint8_t> body)
{
    std::vector<model::TreeEntry> entries;
    std::size_t left = 0;

    while (left < body.size())
    {
        const auto space_index = std::find(body.begin() + static_cast<std::ptrdiff_t>(left),
                                           body.end(), static_cast<std::uint8_t>(' ')) -
                                 body.begin();
        const std::string mode(reinterpret_cast<const char*>(body.data() + left),
                               reinterpret_cast<const char*>(body.data() + space_index));

        const auto null_index = std::find(body.begin() + static_cast<std::ptrdiff_t>(space_index),
                                          body.end(), static_cast<std::uint8_t>('\0')) -
                                body.begin();
        const std::string name(reinterpret_cast<const char*>(body.data() + space_index + 1),
                               reinterpret_cast<const char*>(body.data() + null_index));

        std::ostringstream sha_hex;
        for (std::size_t i = 0; i < 20; ++i)
        {
            sha_hex << std::hex << std::setw(2) << std::setfill('0')
                    << static_cast<int>(body[null_index + 1 + i]);
        }

        left = null_index + 21;
        entries.push_back(model::TreeEntry{model::file_mode_from_string(mode), name,
                                           model::ObjectId::from_hex(sha_hex.str())});
    }

    return entries;
}

TreeBuilder::TreeBuilder(storage::ObjectStore& store) : store_(store) {}

model::ObjectId
TreeBuilder::build_from_index(const std::unordered_map<std::string, model::StagedEntry>& entries)
{
    TreeNode root;
    root.name = "root";
    root.is_blob = false;

    for (const auto& [file_path, staged] : entries)
    {
        std::vector<std::string> parts;
        std::istringstream stream(file_path);
        std::string part;
        while (std::getline(stream, part, '/'))
        {
            if (!part.empty())
            {
                parts.push_back(part);
            }
        }

        TreeNode* current = &root;
        for (std::size_t i = 0; i < parts.size(); ++i)
        {
            if (i == parts.size() - 1)
            {
                TreeNode file_node;
                file_node.name = parts[i];
                file_node.is_blob = true;
                file_node.hash_id = staged.sha;
                current->children.push_back(std::move(file_node));
                break;
            }

            auto it = std::find_if(
                current->children.begin(), current->children.end(),
                [&](const TreeNode& child) { return !child.is_blob && child.name == parts[i]; });
            if (it == current->children.end())
            {
                TreeNode dir_node;
                dir_node.name = parts[i];
                dir_node.is_blob = false;
                current->children.push_back(dir_node);
                it = std::prev(current->children.end());
            }
            current = &(*it);
        }
    }

    return hash_tree(root);
}

model::ObjectId TreeBuilder::hash_tree(TreeNode& node)
{
    std::vector<model::TreeEntry> entries;

    for (auto& child : node.children)
    {
        if (child.is_blob)
        {
            entries.push_back(model::TreeEntry{model::FileMode::Blob, child.name, child.hash_id});
        }
        else
        {
            const auto sha = hash_tree(child);
            entries.push_back(model::TreeEntry{model::FileMode::Tree, child.name, sha});
        }
    }

    std::sort(entries.begin(), entries.end(),
              [](const model::TreeEntry& a, const model::TreeEntry& b) { return a.name < b.name; });

    const auto raw = TreeCodec::encode(entries);
    return store_.write_object(raw);
}

} // namespace minigit::tree

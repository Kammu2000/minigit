#include <algorithm>
#include <sstream>
#include <utility>

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/tree/tree_builder.hpp"

namespace minigit::tree {

    namespace {

        class TreeParser
        {
          public:
            explicit TreeParser(std::span<const std::uint8_t> data) : m_remaining(data) {}

            [[nodiscard]] bool empty() const { return m_remaining.empty(); }

            std::string_view read_until(char delimiter)
            {
                const auto it = std::find(m_remaining.begin(), m_remaining.end(),
                                          static_cast<std::uint8_t>(delimiter));
                const auto end = static_cast<std::size_t>(std::distance(m_remaining.begin(), it));
                const auto view = as_string_view(m_remaining.first(end));

                const auto advance = end + (it != m_remaining.end() ? 1 : 0);
                m_remaining = m_remaining.subspan(advance);
                return view;
            }

            std::span<const std::uint8_t> read_bytes(std::size_t count)
            {
                const auto bytes = m_remaining.first(count);
                m_remaining = m_remaining.subspan(count);
                return bytes;
            }

            void skip(std::size_t count) { m_remaining = m_remaining.subspan(count); }

          private:
            static std::string_view as_string_view(std::span<const std::uint8_t> data)
            {
                return {reinterpret_cast<const char*>(data.data()), data.size()};
            }

            std::span<const std::uint8_t> m_remaining;
        };

    } // namespace

    std::vector<std::uint8_t> TreeCodec::encode(const std::vector<model::TreeEntry>& entries)
    {
        std::vector<std::uint8_t> body;

        for (const auto& entry : entries)
        {
            const std::string header =
                std::string(model::to_string(entry.mode)) + ' ' + entry.name + '\0';
            body.insert(body.end(), header.begin(), header.end());

            const auto raw_sha = entry.sha.raw_bytes();
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
        TreeParser parser(body);

        while (!parser.empty())
        {
            const auto mode = parser.read_until(' ');
            const auto name = parser.read_until('\0');
            const auto sha_bytes = parser.read_bytes(model::ObjectId::kRawSize);

            entries.emplace_back(model::file_mode_from_string(mode), std::string(name),
                                 model::ObjectId::from_bytes(sha_bytes));
        }

        return entries;
    }

    TreeBuilder::TreeBuilder(storage::ObjectStore& store) : m_store(store) {}

    model::ObjectId TreeBuilder::build_from_index(
        const std::unordered_map<std::string, model::StagedEntry>& entries)
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

                auto it = std::find_if(current->children.begin(), current->children.end(),
                                       [&](const TreeNode& child) {
                                           return !child.is_blob && child.name == parts[i];
                                       });
                if (it == current->children.end())
                {
                    TreeNode dir_node;
                    dir_node.name = parts[i];
                    dir_node.is_blob = false;
                    current->children.push_back(std::move(dir_node));
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
                entries.push_back(
                    model::TreeEntry{model::FileMode::Blob, child.name, child.hash_id});
            }
            else
            {
                const auto sha = hash_tree(child);
                entries.push_back(model::TreeEntry{model::FileMode::Tree, child.name, sha});
            }
        }

        std::sort(
            entries.begin(), entries.end(),
            [](const model::TreeEntry& a, const model::TreeEntry& b) { return a.name < b.name; });

        const auto raw = TreeCodec::encode(entries);
        return m_store.write_object(raw);
    }

} // namespace minigit::tree

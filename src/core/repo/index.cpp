#include <algorithm>
#include <fstream>
#include <sstream>

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/repo/index.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::repo {

Index::Index(std::filesystem::path index_path) : m_index_path(std::move(index_path)) {}

void Index::load()
{
    m_entries.clear();
    if (!std::filesystem::exists(m_index_path))
    {
        return;
    }

    std::ifstream in(m_index_path);
    std::string line;
    while (std::getline(in, line))
    {
        if (line.empty())
        {
            continue;
        }

        std::istringstream stream(line);
        std::string mode_str;
        std::string path;
        std::string sha;
        stream >> mode_str >> path >> sha;
        if (mode_str.empty() || path.empty() || sha.empty())
        {
            continue;
        }

        m_entries[path] = model::StagedEntry{model::file_mode_from_string(mode_str),
                                            model::ObjectId::from_hex(sha)};
    }
}

void Index::save() const
{
    std::vector<std::string> paths;
    paths.reserve(m_entries.size());
    for (const auto& [path, _] : m_entries)
    {
        paths.push_back(path);
    }
    std::sort(paths.begin(), paths.end());

    std::ostringstream out;
    for (std::size_t i = 0; i < paths.size(); ++i)
    {
        const auto& entry = m_entries.at(paths[i]);
        out << model::to_string(entry.mode) << ' ' << paths[i] << ' ' << entry.sha.to_string();
        if (i + 1 < paths.size())
        {
            out << '\n';
        }
    }

    std::ofstream file(m_index_path);
    if (!file)
    {
        throw Error(ErrorCode::PathNotFound, "failed to write index file");
    }
    file << out.str();
}

void Index::stage(const std::string& path, const model::StagedEntry& entry)
{
    m_entries[path] = entry;
}

void Index::unstage(const std::string& path)
{
    m_entries.erase(path);
}

bool Index::contains(const std::string& path) const
{
    return m_entries.find(path) != m_entries.end();
}

const model::StagedEntry* Index::find(const std::string& path) const
{
    const auto it = m_entries.find(path);
    if (it == m_entries.end())
    {
        return nullptr;
    }
    return &it->second;
}

} // namespace minigit::repo

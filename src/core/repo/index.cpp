#include <algorithm>
#include <fstream>
#include <sstream>

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/repo/index.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::repo {

Index::Index(std::filesystem::path index_path) : index_path_(std::move(index_path)) {}

void Index::load()
{
    entries_.clear();
    if (!std::filesystem::exists(index_path_))
    {
        return;
    }

    std::ifstream in(index_path_);
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

        entries_[path] = model::StagedEntry{model::file_mode_from_string(mode_str),
                                            model::ObjectId::from_hex(sha)};
    }
}

void Index::save() const
{
    std::vector<std::string> paths;
    paths.reserve(entries_.size());
    for (const auto& [path, _] : entries_)
    {
        paths.push_back(path);
    }
    std::sort(paths.begin(), paths.end());

    std::ostringstream out;
    for (std::size_t i = 0; i < paths.size(); ++i)
    {
        const auto& entry = entries_.at(paths[i]);
        out << model::to_string(entry.mode) << ' ' << paths[i] << ' ' << entry.sha.to_string();
        if (i + 1 < paths.size())
        {
            out << '\n';
        }
    }

    std::ofstream file(index_path_);
    if (!file)
    {
        throw Error(ErrorCode::PathNotFound, "failed to write index file");
    }
    file << out.str();
}

void Index::stage(const std::string& path, const model::StagedEntry& entry)
{
    entries_[path] = entry;
}

void Index::unstage(const std::string& path)
{
    entries_.erase(path);
}

bool Index::contains(const std::string& path) const
{
    return entries_.find(path) != entries_.end();
}

const model::StagedEntry* Index::find(const std::string& path) const
{
    const auto it = entries_.find(path);
    if (it == entries_.end())
    {
        return nullptr;
    }
    return &it->second;
}

} // namespace minigit::repo

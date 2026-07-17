#include <algorithm>
#include <fstream>
#include <sstream>

#include "minigit/core/model/object_type.hpp"
#include "minigit/core/storage/compression.hpp"
#include "minigit/core/storage/hashing.hpp"
#include "minigit/core/storage/object_store.hpp"
#include "minigit/common/util/error.hpp"

namespace minigit::storage {

    ObjectStore::ObjectStore(std::filesystem::path root) : m_root(std::move(root)) {}

    std::filesystem::path ObjectStore::objects_dir() const
    {
        return m_root / ".minigit" / "objects";
    }

    std::vector<std::uint8_t>
    ObjectStore::build_raw_object(std::string_view type, std::span<const std::uint8_t> body) const
    {
        std::ostringstream header;
        header << type << ' ' << body.size() << '\0';
        const std::string header_str = header.str();

        std::vector<std::uint8_t> raw;
        raw.reserve(header_str.size() + body.size());
        raw.insert(raw.end(), header_str.begin(), header_str.end());
        raw.insert(raw.end(), body.begin(), body.end());
        return raw;
    }

    void ObjectStore::store_raw(const std::vector<std::uint8_t>& raw_object,
                                const model::ObjectId& id)
    {
        const auto dir = objects_dir() / id.view().substr(0, 2);
        const auto file = dir / id.view().substr(2);

        std::filesystem::create_directories(dir);
        const auto compressed = deflate(raw_object);

        std::ofstream out(file, std::ios::binary);
        if (!out)
        {
            throw Error(ErrorCode::PathNotFound, "failed to write object file");
        }
        out.write(reinterpret_cast<const char*>(compressed.data()),
                  static_cast<std::streamsize>(compressed.size()));
    }

    model::ObjectId ObjectStore::write_object(const std::vector<std::uint8_t>& raw_object)
    {
        const auto id = model::ObjectId::from_hex(sha1_hex(raw_object));
        store_raw(raw_object, id);
        return id;
    }

    model::ObjectId ObjectStore::hash_blob(std::span<const std::uint8_t> content, bool write)
    {
        const auto raw = build_raw_object("blob", content);
        const auto id = model::ObjectId::from_hex(sha1_hex(raw));

        if (write)
        {
            store_raw(raw, id);
        }
        return id;
    }

    model::ObjectId ObjectStore::hash_file(const std::filesystem::path& file_path, bool write)
    {
        std::ifstream in(file_path, std::ios::binary);
        if (!in)
        {
            throw Error(ErrorCode::FileNotFound, "file not found: " + file_path.string());
        }

        const std::vector<std::uint8_t> content((std::istreambuf_iterator<char>(in)),
                                                std::istreambuf_iterator<char>());
        return hash_blob(content, write);
    }

    model::GitObject ObjectStore::read(const model::ObjectId& id) const
    {
        const auto file = objects_dir() / id.view().substr(0, 2) / id.view().substr(2);
        if (!std::filesystem::exists(file))
        {
            throw Error(ErrorCode::ObjectNotFound,
                        "OBJECT_NOT_FOUND_ERROR: object with " + id.to_string() + " was not found");
        }

        std::ifstream in(file, std::ios::binary);
        const std::vector<std::uint8_t> compressed((std::istreambuf_iterator<char>(in)),
                                                   std::istreambuf_iterator<char>());
        const auto buffer = inflate(compressed);

        const auto null_index = std::find(buffer.begin(), buffer.end(), '\0');
        if (null_index == buffer.end())
        {
            throw Error(ErrorCode::ObjectCorrupted,
                        "OBJECT_CORRUPTED_ERROR: object with " + id.to_string() + " is corrupted");
        }

        const std::string header(buffer.begin(), null_index);
        const auto space = header.find(' ');
        if (space == std::string::npos)
        {
            throw Error(ErrorCode::ObjectCorrupted,
                        "OBJECT_CORRUPTED_ERROR: object with " + id.to_string() + " is corrupted");
        }

        const std::string type_str = header.substr(0, space);
        [[maybe_unused]] const std::string size_str = header.substr(space + 1);

        model::GitObject object;
        object.type = model::object_type_from_string(type_str);
        object.body.assign(null_index + 1, buffer.end());
        return object;
    }

} // namespace minigit::storage

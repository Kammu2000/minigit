#pragma once

#include "minigit/core/model/git_object.hpp"
#include "minigit/core/model/object_id.hpp"

#include <filesystem>
#include <span>
#include <string_view>
#include <vector>

namespace minigit::storage {

class ObjectStore
{
  public:
    explicit ObjectStore(std::filesystem::path root);

    [[nodiscard]] model::ObjectId hash_blob(std::span<const std::uint8_t> content,
                                            bool write = false);
    [[nodiscard]] model::ObjectId hash_file(const std::filesystem::path& file_path,
                                            bool write = false);
    [[nodiscard]] model::ObjectId write_object(const std::vector<std::uint8_t>& raw_object);
    [[nodiscard]] model::GitObject read(const model::ObjectId& id) const;

    [[nodiscard]] std::vector<std::uint8_t>
    build_raw_object(std::string_view type, std::span<const std::uint8_t> body) const;

  private:
    std::filesystem::path root_;
    std::filesystem::path objects_dir() const;
    void store_raw(const std::vector<std::uint8_t>& raw_object, const model::ObjectId& id);
};

} // namespace minigit::storage

#pragma once

#include <cstdint>
#include <format>
#include <string_view>

namespace minigit::model {

    enum class ObjectType : std::uint8_t
    {
        Blob,
        Tree,
        Commit
    };

    inline std::string_view to_string(ObjectType type)
    {
        switch (type)
        {
            case ObjectType::Blob:
                return "blob";
            case ObjectType::Tree:
                return "tree";
            case ObjectType::Commit:
                return "commit";
        }

        throw std::runtime_error("Unknown object type conversion to string");
    }

    inline ObjectType object_type_from_string(std::string_view type)
    {
        if (type == "blob")
            return ObjectType::Blob;
        if (type == "tree")
            return ObjectType::Tree;
        if (type == "commit")
            return ObjectType::Commit;

        throw std::runtime_error(std::format("Unknown object type: {}", type));
    }

} // namespace minigit::model

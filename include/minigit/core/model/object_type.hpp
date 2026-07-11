#pragma once

#include <string_view>

namespace minigit::model {

enum class ObjectType
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
    return "unknown";
}

inline ObjectType object_type_from_string(std::string_view type)
{
    if (type == "blob")
        return ObjectType::Blob;
    if (type == "tree")
        return ObjectType::Tree;
    if (type == "commit")
        return ObjectType::Commit;
    return ObjectType::Blob;
}

} // namespace minigit::model

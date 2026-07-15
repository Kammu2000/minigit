#pragma once

#include <vector>

#include "minigit/core/model/object_type.hpp"

namespace minigit::model {

    struct GitObject
    {
        ObjectType type = ObjectType::Blob;
        std::vector<uint8_t> body;
    };

} // namespace minigit::model

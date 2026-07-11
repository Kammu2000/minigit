#pragma once

#include "minigit/core/model/object_type.hpp"

#include <cstdint>
#include <vector>

namespace minigit::model {

struct GitObject
{
    ObjectType type = ObjectType::Blob;
    std::vector<std::uint8_t> body;
};

} // namespace minigit::model

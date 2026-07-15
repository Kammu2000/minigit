#pragma once

#include <string>

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/model/object_id.hpp"

namespace minigit::model {

    struct TreeEntry
    {
        FileMode mode = FileMode::Blob;
        std::string name;
        ObjectId sha;
    };

} // namespace minigit::model

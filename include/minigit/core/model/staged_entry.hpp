#pragma once

#include "minigit/core/model/file_mode.hpp"
#include "minigit/core/model/object_id.hpp"

namespace minigit::model {

    struct StagedEntry
    {
        FileMode mode = FileMode::Blob;
        ObjectId sha;
    };

} // namespace minigit::model

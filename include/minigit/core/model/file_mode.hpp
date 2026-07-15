#pragma once

#include <format>

namespace minigit::model {

    enum class FileMode : uint32_t
    {
        Blob = 0100644,
        Tree = 040000
    };

    inline std::string_view to_string(FileMode mode)
    {
        switch (mode)
        {
            case FileMode::Blob:
                return "100644";
            case FileMode::Tree:
                return "040000";
        }

        throw std::runtime_error("Unknown file mode conversion to string");
    }

    inline FileMode file_mode_from_string(std::string_view mode)
    {
        if (mode == "100644")
            return FileMode::Blob;
        if (mode == "040000")
            return FileMode::Tree;

        throw std::runtime_error(std::format("Unknown object mode: {}", mode));
    }

} // namespace minigit::model

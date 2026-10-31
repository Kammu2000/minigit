#include <zlib.h>

#include "minigit/common/util/assert.hpp"
#include "minigit/common/util/error.hpp"
#include "minigit/core/storage/compression.hpp"

namespace minigit::storage {

    std::vector<std::uint8_t> deflate(std::span<const std::uint8_t> data)
    {
        uLong bound = compressBound(static_cast<uLong>(data.size()));
        std::vector<std::uint8_t> output(bound);
        uLong output_size = bound;

        const int result = compress2(output.data(), &output_size, data.data(),
                                     static_cast<uLong>(data.size()), Z_BEST_SPEED);
        invariant_(result == Z_OK, "zlib compression failed");

        output.resize(output_size);
        return output;
    }

    std::vector<std::uint8_t> inflate(std::span<const std::uint8_t> data)
    {
        std::vector<std::uint8_t> output(data.size() * 4 + 1024);
        uLong output_size = static_cast<uLong>(output.size());

        int result =
            uncompress(output.data(), &output_size, data.data(), static_cast<uLong>(data.size()));
        while (result == Z_BUF_ERROR)
        {
            output.resize(output.size() * 2);
            output_size = static_cast<uLong>(output.size());
            result = uncompress(output.data(), &output_size, data.data(),
                                static_cast<uLong>(data.size()));
        }

        if (result != Z_OK)
        {
            throw Error(ErrorCode::ObjectCorrupted,
                        "OBJECT_CORRUPTED_ERROR: zlib decompression failed, object data may be "
                        "corrupted");
        }

        output.resize(output_size);
        return output;
    }

} // namespace minigit::storage

#include <array>
#include <iomanip>
#include <sstream>
#include <openssl/evp.h>

#include "minigit/common/util/assert.hpp"
#include "minigit/core/storage/hashing.hpp"

namespace minigit::storage {

    namespace {

        std::array<unsigned char, EVP_MAX_MD_SIZE> digest_sha1(std::span<const std::uint8_t> data)
        {
            std::array<unsigned char, EVP_MAX_MD_SIZE> hash{};
            unsigned int hash_len = 0;

            EVP_MD_CTX* ctx = EVP_MD_CTX_new();
            invariant_(ctx != nullptr, "failed to allocate digest context");

            const bool digest_ok = EVP_DigestInit_ex(ctx, EVP_sha1(), nullptr) == 1 &&
                                   EVP_DigestUpdate(ctx, data.data(), data.size()) == 1 &&
                                   EVP_DigestFinal_ex(ctx, hash.data(), &hash_len) == 1;

            EVP_MD_CTX_free(ctx);
            invariant_(digest_ok, "SHA-1 digest failed");
            hash_len = 20;
            return hash;
        }

    } // namespace

    std::string sha1_hex(std::span<const std::uint8_t> data)
    {
        const auto hash = digest_sha1(data);
        std::ostringstream stream;

        for (int i = 0; i < 20; ++i)
        {
            stream << std::hex << std::setw(2) << std::setfill('0')
                   << static_cast<int>(hash[static_cast<std::size_t>(i)]);
        }

        return stream.str();
    }

    std::vector<std::uint8_t> sha1_bytes(std::span<const std::uint8_t> data)
    {
        const auto hash = digest_sha1(data);
        return std::vector<std::uint8_t>(hash.begin(), hash.begin() + 20);
    }

} // namespace minigit::storage

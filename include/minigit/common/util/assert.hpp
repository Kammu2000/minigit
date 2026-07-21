#pragma once

#include <cstdlib>
#include <cstdio>
#include <cinttypes>
#include <source_location>
#include <string_view>

namespace contract::detail {

    [[noreturn]]
    inline void panic_impl(std::string_view kind, std::string_view expression,
                           std::string_view message, std::source_location location)
    {
        std::fprintf(stderr, "%s:%" PRIu32 ":%" PRIu32 ": %.*s\n", location.file_name(),
                     location.line(), location.column(), static_cast<int>(kind.size()),
                     kind.data());

        if (const char* function = location.function_name(); *function != '\0')
        {
            std::fprintf(stderr, "  function: %s\n", function);
        }

        if (!expression.empty())
        {
            std::fprintf(stderr, "  expression: %.*s\n", static_cast<int>(expression.size()),
                         expression.data());
        }

        if (!message.empty())
        {
            std::fprintf(stderr, "  message: %.*s\n", static_cast<int>(message.size()),
                         message.data());
        }

        std::fflush(stderr);
        std::abort();
    }

    [[noreturn]]
    inline void panic_impl(std::string_view kind, std::string_view expression,
                           std::source_location location)
    {
        panic_impl(kind, expression, {}, location);
    }

    inline void panic_if_not(bool condition, std::source_location location, std::string_view kind,
                             std::string_view expression, std::string_view message = {})
    {
        if (!condition)
        {
            panic_impl(kind, expression, message, location);
        }
    }

} // namespace contract::detail

#define panic_(...)                                                                                \
    ::contract::detail::panic_impl("panic", "" __VA_OPT__(, __VA_ARGS__),                          \
                                   std::source_location::current())

#define precondition_(expr, ...)                                                                   \
    ::contract::detail::panic_if_not(static_cast<bool>((expr)), std::source_location::current(),   \
                                     "precondition", #expr __VA_OPT__(, __VA_ARGS__))

#define invariant_(expr, ...)                                                                      \
    ::contract::detail::panic_if_not(static_cast<bool>((expr)), std::source_location::current(),   \
                                     "invariant", #expr __VA_OPT__(, __VA_ARGS__))

#ifndef NDEBUG

#define assert_(expr, ...)                                                                         \
    ::contract::detail::panic_if_not(static_cast<bool>((expr)), std::source_location::current(),   \
                                     "assert", #expr __VA_OPT__(, __VA_ARGS__))

#define precondition_expensive_(expr, ...) precondition_(expr __VA_OPT__(, __VA_ARGS__))
#define assert_expensive_(expr, ...) assert_(expr __VA_OPT__(, __VA_ARGS__))
#define invariant_expensive_(expr, ...) invariant_(expr __VA_OPT__(, __VA_ARGS__))

#else

#define assert_(...) ((void)0)
#define precondition_expensive_(...) ((void)0)
#define assert_expensive_(...) ((void)0)
#define invariant_expensive_(...) ((void)0)

#endif

#define unreachable_(...)                                                                          \
    ::contract::detail::panic_impl("unreachable", "" __VA_OPT__(, __VA_ARGS__),                    \
                                   std::source_location::current())

#define unimplemented_(...)                                                                        \
    ::contract::detail::panic_impl("unimplemented", "" __VA_OPT__(, __VA_ARGS__),                  \
                                   std::source_location::current())

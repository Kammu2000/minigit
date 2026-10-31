# Exception Handling & Contracts

This project uses two distinct, deliberately non-overlapping failure-reporting
channels. Picking the right one for a given failure is the single most
important rule in this document.

## The two channels

### 1. `minigit::Error` (`include/minigit/common/util/error.hpp`)

A `std::runtime_error` subtype carrying an `ErrorCode`. Thrown with regular
`throw`, caught in `main.cpp`, and reported to the user as a normal CLI error
(exit code 1, message on stderr).

Use `Error` for **recoverable, data/user-facing** failures — conditions that
are expected to happen during normal operation and that the caller (a human
running the CLI) can act on:

- bad CLI arguments / unknown commands (`ErrorCode::InvalidCommand`)
- repository not found / already initialized
- missing files, missing objects
- corrupted on-disk data that originates from outside the current process's
  control (e.g. a `.minigit/objects` blob that failed to decompress)

### 2. Contract macros (`include/minigit/common/util/assert.hpp`)

`precondition_`, `invariant_`, `assert_`, `unreachable_`, `unimplemented_`,
and `panic_`. These print a diagnostic (expression, message, source
location) to stderr and call `std::abort()`. They are **not exceptions** —
they cannot be caught, and they intentionally crash the process.

Use contract macros for **programmer errors / "can't happen" conditions** —
bugs that no amount of valid user input should ever trigger:

| Macro | When to use |
|---|---|
| `precondition_(expr, msg)` | A function's documented input contract was violated by its caller (always checked, including in release builds). |
| `invariant_(expr, msg)` | An internal invariant that must hold for the code to be correct (e.g. a third-party API call that should never fail given how we call it). Always checked. |
| `assert_(expr, msg)` | Same as `invariant_`, but expensive enough that it's only worth checking in debug builds (compiled out when `NDEBUG` is defined). |
| `unreachable_(msg)` | Control flow reached a branch that is logically impossible if all earlier invariants held (e.g. the tail of an otherwise-exhaustive `switch` over an enum). |
| `unimplemented_(msg)` | A stub for functionality that doesn't exist yet. |
| `panic_(msg)` | Direct, unconditional crash for any other "this should never happen" situation. |

`NDEBUG` (set automatically by CMake in Release builds) only affects
`assert_` and the `*_expensive_` variants; `precondition_`, `invariant_`,
`unreachable_`, `unimplemented_`, and `panic_` are always active.

## Decision rule

Ask: **"Can a user trigger this by feeding the program bad-but-plausible
input, or by the environment misbehaving in an expected way (missing file,
corrupt object, bad CLI args)?"**

- **Yes** → throw `minigit::Error`.
- **No, this can only happen if the code itself has a bug** (an exhaustive
  switch fell through, a documented precondition wasn't met by an internal
  caller, a library call failed in a way our own usage should prevent) →
  use a contract macro from `assert.hpp`.

## Examples from this codebase

- `model::to_string(ObjectType)` / `object_type_from_string`: the switch and
  the string comparisons are exhaustive for all values this process ever
  writes itself, so falling through is a bug, not bad user input →
  `unreachable_(...)`.
- `storage::sha1_hex` (`hashing.cpp`): `EVP_MD_CTX_new`/`EVP_Digest*`
  failing given our fixed, correct usage of the OpenSSL API indicates a
  library/programming invariant violation, not something a user caused →
  `invariant_(...)`.
- `storage::deflate` (`compression.cpp`): compressing data we generated
  ourselves into a buffer we sized with `compressBound` should never fail →
  `invariant_(...)`.
- `storage::inflate` (`compression.cpp`): decompressing bytes read back from
  `.minigit/objects` *can* legitimately fail if the object file on disk is
  corrupted (disk/user issue, not a code bug) → `throw Error(ErrorCode::ObjectCorrupted, ...)`.
- CLI commands (`src/cli/commands/*.cpp`): each `Command::execute` (other
  than `init`) documents and checks its true precondition that it is only
  ever invoked with a non-null, open `Repository*` via
  `precondition_(repo != nullptr, ...)`. This makes an assumption that was
  previously only implicit in `main.cpp`'s dispatch logic explicit and
  future-proof against new call sites (e.g. tests, library embedding).
- `tree::TreeParser::read_bytes` (`tree_builder.cpp`): decoding a tree
  object's body walks a byte span assuming well-formed input. Without a
  bounds check, a truncated/corrupted body would hit undefined behavior via
  `std::span::first`/`subspan`. `precondition_(count <= m_remaining.size(), ...)`
  turns that latent UB into a clear, diagnosable crash instead.
- `model::ObjectId::raw_bytes()`: every code path that can construct an
  `ObjectId` (the constructor, `from_hex`, `from_bytes`) already validates
  the hex string, so by the time `raw_bytes()` runs, "non-empty implies
  40 valid hex chars" is a true class invariant, not something the caller
  can violate externally. It now expresses that directly:
  `precondition_(!m_hex.empty(), ...)` documents the real precondition on
  the caller (don't call this on a default-constructed id), and
  `invariant_(m_hex.size() == kHexLength, ...)` documents the class
  invariant, replacing a redundant re-validation that previously threw a
  catchable (but never actually user-facing) `Error`.

## Adding new failure sites

When introducing a new failure site, pick the channel using the decision
rule above instead of defaulting to exceptions everywhere. When in doubt,
prefer `Error` for anything reachable from parsing user input or reading
files from disk, and reserve contract macros for violations of this
codebase's own internal assumptions.

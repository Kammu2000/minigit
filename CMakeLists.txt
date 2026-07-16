cmake_minimum_required(VERSION 3.25)
project(minigit VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)

set(SOURCES
  src/main.cpp
  src/common/util/paths.cpp
  src/core/model/object_id.cpp
  src/core/storage/hashing.cpp
  src/core/storage/compression.cpp
  src/core/storage/object_store.cpp
  src/core/repo/index.cpp
  src/core/repo/refs.cpp
  src/core/repo/ignore_rules.cpp
  src/core/repo/worktree_scanner.cpp
  src/core/repo/repository.cpp
  src/core/tree/tree_builder.cpp
  src/core/diff/diff_engine.cpp
  src/format/colors.cpp
  src/format/output.cpp
  src/cli/parser.cpp
  src/cli/registry.cpp
  src/cli/commands/init_command.cpp
  src/cli/commands/hash_object_command.cpp
  src/cli/commands/cat_file_command.cpp
  src/cli/commands/write_tree_command.cpp
  src/cli/commands/ls_tree_command.cpp
  src/cli/commands/add_command.cpp
  src/cli/commands/restore_command.cpp
  src/cli/commands/status_command.cpp
  src/cli/commands/commit_command.cpp
  src/cli/commands/log_command.cpp
  src/cli/commands/branch_command.cpp
  src/cli/commands/diff_command.cpp
)

add_executable(minigit)

target_sources(minigit PRIVATE ${SOURCES})
target_include_directories(minigit PRIVATE include)
target_link_libraries(minigit PRIVATE OpenSSL::Crypto ZLIB::ZLIB)

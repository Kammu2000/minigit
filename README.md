# minigit

A minimal but useful implementation of git's core internals, built from scratch in C++ to understand how git actually works under the hood.

## Why I Built This

Most developers use git daily without knowing what's inside `.git`. I built minigit to understand git's object model — blobs, trees, the index, and content-addressable storage — by implementing them myself.

## Prerequisites

- C++23 compiler (Clang 17+ or GCC 13+)
- CMake 3.25+
- Ninja
- [vcpkg](https://vcpkg.io)

## Build

```bash
git clone https://github.com/microsoft/vcpkg.git ~/vcpkg
~/vcpkg/bootstrap-vcpkg.sh

export VCPKG_ROOT=~/vcpkg

cmake --preset=build
cmake --build build
```

The binary is at `build/minigit`. On the first build, vcpkg installs **openssl** and **zlib** from `vcpkg.json`.

## Commands

| Command                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| `minigit init`                    | Initialize a new repository                          |
| `minigit hash-object [-w] <file>` | Compute (and optionally store) a blob object         |
| `minigit cat-file -p <sha>`       | Print the content of a stored object                 |
| `minigit cat-file -t <sha>`       | Print the type of a stored object                    |
| `minigit write-tree`              | Get updated sha of root directory using staged files |
| `minigit ls-tree <sha>`           | List the contents of a tree object                   |
| `minigit add <filePath>`          | Stage a file or directory                            |
| `minigit restore <filePath>...`   | Unstage one or more files/directories                |
| `minigit status`                  | Check current working status of repository           |
| `minigit commit -m <message>`     | Commit changes with the staged files                 |
| `minigit log`                     | Check commit history of current branch in less pager |
| `minigit branch`                  | List down all the branches                           |
| `minigit diff`                    | Compare files in index vs working area               |

## What's Next

- `diff --staged` — compare files in index vs head commit
- `checkout` — first-class branch support

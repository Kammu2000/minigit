# minigit

A minimal implementation of git's core internals, built from scratch in Node.js to understand how git actually works under the hood.

## Why I Built This

Most developers use git daily without knowing what's inside `.git`. I built minigit to understand git's object model — blobs, trees, the index, and content-addressable storage — by implementing them myself.

## Getting Started

```bash
npm install
npm link
```

## Commands

| Command | Description |
|---|---|
| `minigit init` | Initialize a new repository |
| `minigit add <path>` | Stage a file or directory |
| `minigit hash-object [-w] <file>` | Compute (and optionally store) a blob object |
| `minigit cat-file -p <sha>` | Print the content of a stored object |
| `minigit write-tree` | Snapshot the working directory as a tree object |
| `minigit ls-tree <sha>` | List the contents of a tree object |
| `minigit restore <file>` | Unstage a file |

## What's Next

- `commit` — create commit objects and wire up HEAD
- `log` — walk the parent chain
- `status` — diff working tree vs index vs HEAD
- `diff` — compare file versions across commits
- `branch` / `checkout` — first-class branch support

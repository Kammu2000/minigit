import path from "path";

export const MODE = {
  BLOB: "100644",
  TREE: "040000",
} as const;

export const MODE_VS_TYPE = {
  "100644": "BLOB",
  "040000": "TREE",
} as const;

export const INDEX_FILE_PATH = path.join(process.cwd(), ".minigit/index");

export const EMPTY_OBJECT_READONLY = {};

export const HASH_ID_LENGTH = 20;

export enum OBJECT_TYPE {
  BLOB = "BLOB",
  TREE = "TREE",
  COMMIT = "COMMIT",
}

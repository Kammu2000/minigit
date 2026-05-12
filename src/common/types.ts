import { MODE } from "./constants.js";
import { red } from "./helpers/colors.js";

export type HashId = string;

export interface HashOptions {
  write?: boolean;
}

export interface TreeEntry {
  mode: (typeof MODE)[keyof typeof MODE];
  name: string;
  sha: HashId;
}

export type IndexMap = Map<string, { mode: TreeEntry["mode"]; sha: HashId }>;
export type HeadpMap = Map<string, HashId>;

export enum FileStatus {
  WORKING_DIR = "WORKING_DIR",
  STAGED = "STAGED",
  UNTRACKED = "UNTRACKED",
}

export enum FileSubStatus {
  NEW_FILE = "newFile",
  DELETED = "deleted",
  MODIFIED = "modified",
  UNTRACKED = "",
}

export type StatusVsFilesMap = Record<FileStatus, [FileSubStatus, string][]>;

export interface BlobNode {
  name: string;
  type: (typeof MODE)[keyof typeof MODE];
  hashId: HashId;
}

export interface TreeNode {
  name: string;
  type: (typeof MODE)[keyof typeof MODE];
  children: Array<TreeNode | BlobNode>;
}

export interface ParsedObject {
  type: string;
  size: number;
  body: Buffer<ArrayBuffer>;
}

export interface EditPosition {
  oldLine: number | null;
  newLine: number | null;
}

export interface Edit {
  type: "equal" | "inserted" | "deleted";
  content: string;
  position: EditPosition;
}

export interface FileDiff {
  filePath: string;
  edits: Edit[];
}

export type ColorWrapperFn = typeof red;

import { MODE } from "./constants.js";

export type HashId = string;

export type HashOptions = {
  write?: boolean;
};

export type TreeEntry = {
  mode: (typeof MODE)[keyof typeof MODE];
  name: string;
  sha: HashId;
};

export type IndexMap = Map<string, { mode: TreeEntry["mode"]; sha: HashId }>;
export type HeadpMap = Map<string, string>;

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

export type CLIInput = {
  command: string;
  args: string[];
};

export type BlobNode = {
  name: string;
  type: (typeof MODE)[keyof typeof MODE];
  hashId: HashId;
};

export type TreeNode = {
  name: string;
  type: (typeof MODE)[keyof typeof MODE];
  children: Array<TreeNode | BlobNode>;
};

export type ParsedObject = {
  type: string;
  size: number;
  body: Buffer<ArrayBuffer>;
};

export type EditPosition = {
  oldLine: number | null;
  newLine: number | null;
};

export type Edit = {
  type: "equal" | "inserted" | "deleted";
  content: string;
  position: EditPosition;
};

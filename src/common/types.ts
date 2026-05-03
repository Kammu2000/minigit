import { MODE } from "./constants.js";

export type HashId = string;

export type HashOptions = {
  write?: boolean;
}

export type TreeEntry = {
  mode: typeof MODE[keyof typeof MODE];
  name: string;
  sha: HashId;
}

export type IndexMap = Map<string, { mode: TreeEntry['mode'], sha: HashId }>;

export enum FileStatus {
  MODIFIED =  "MODIFIED",
  STAGED = "STAGED",
  UNTRACKED = "UNTRACKED",
  DELETED = "DELETED"
};

export type StatusVsFilesMap = Record<FileStatus, string[]>;

export type CLIInput = {
  command: string;
  args: string[];
};

export type BlobNode = {
  name: string;
  type: typeof MODE[keyof typeof MODE];
  hashId: HashId;
}

export type TreeNode = {
  name: string;
  type: typeof MODE[keyof typeof MODE];
  children: Array<TreeNode | BlobNode>;
}

export type ParsedObject = {
  type: string;
  size: number;
  body: Buffer<ArrayBuffer>;
}


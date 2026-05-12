import { readObject } from "../object/readObject.js";
import { decodeTreeObject } from "./decodeTree.js";
import { HashId, TreeEntry } from "../../common/types.js";

export const lsTree = (treeHash: HashId): TreeEntry[] => {
  const { body: treeBody } = readObject(treeHash);
  return decodeTreeObject(treeBody);
};

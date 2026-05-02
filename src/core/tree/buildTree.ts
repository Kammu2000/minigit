import path from "path";
import { Dirent } from "fs";
import { getFileHash } from "../object/getFileHash.js";
import { writeTree } from "./writeTree.js";
import { MODE } from "../../common/constants.js";
import { TreeEntry } from "../../common/types.js";

export const buildTreeEntries = (items: Dirent<string>[], dir: string): TreeEntry[] => {
  const entries: TreeEntry[] = [];

  for(const item of items){
    if(item.isFile()){
      const filePath = path.join(dir, item.name);
      const fileSha = getFileHash(filePath, { write: true });
      entries.push({ mode: MODE.BLOB, name: item.name, sha: fileSha });
    }
    else if(item.isDirectory()){
      const dirPath = path.join(dir, item.name);
      const sha = writeTree(dirPath);
      entries.push({ mode: MODE.TREE, name: item.name, sha });
    }
  }
  
  return entries;
};


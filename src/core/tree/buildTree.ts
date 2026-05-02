import path from "path";
import { Dirent } from "fs";
import hashObject from "../object/getFileHash";
import { writeTree } from "./writeTree";
import { MODE } from "../../constants";
import { TreeEntry } from "../../types";

export const buildTreeEntries = (items: Dirent<string>[], dir: string): TreeEntry[] => {
  const entries: TreeEntry[] = [];

  for(const item of items){
    if(item.isFile()){
      const filePath = path.join(dir, item.name);
      const fileSha = hashObject(filePath, { write: true });
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


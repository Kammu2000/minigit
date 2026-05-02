import fs from 'fs';
import { INDEX_FILE_PATH } from '../../common/constants.js';
import { HashId, IndexMap, TreeEntry } from '../../common/types.js';

export const readIndex = (): IndexMap  => {
  const index: IndexMap  = new Map();

  if(!fs.existsSync(INDEX_FILE_PATH)){
    return index;
  }

  const content = fs.readFileSync(INDEX_FILE_PATH, "utf8").trim();
  
  if(!content){
    return index;
  }

  const lines = content.split("\n");

  for(const line of lines){
    const [mode, filePath, sha] = line.split(" ") as [TreeEntry['mode'], string, HashId];
    index.set(filePath, { mode, sha });
  }
    
  return index;
}

export const writeIndex = (index: IndexMap): void => {
  const lines: string[] = [];
  const sortedPaths = Array.from(index.keys()).sort();

  for(const filePath of sortedPaths){
    const { mode, sha } = index.get(filePath)!;
    lines.push(`${mode} ${filePath} ${sha}`)
  }

  fs.writeFileSync(INDEX_FILE_PATH, lines.join("\n"));
  return;
}


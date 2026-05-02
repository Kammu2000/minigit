import fs from 'fs';
import { INDEX_FILE_PATH } from '../../common/constants';
import { HashId, TreeEntry } from '../../common/types';

export const readIndex = (): Map<string, { mode: TreeEntry['mode'], sha: HashId }>  => {
  const index: Map<string, { mode: TreeEntry['mode'], sha: HashId }> = new Map();

  if(!fs.existsSync(INDEX_FILE_PATH)){
    return index;
  }

  const content = fs.readFileSync(INDEX_FILE_PATH, "utf8").trim();
  
  if(!content){
    return index;
  }

  const lines = content.split("\n");

  for(const line of lines){
    const [mode, filePath, sha] = line.split(" ");
    index.set(filePath, { mode, sha } as { mode: TreeEntry['mode'], sha: HashId });
  }
    
  return index;
}

export const writeIndex = (index: Map<string, { mode: TreeEntry['mode'], sha: HashId }>): void => {
  const lines: string[] = [];
  const sortedPaths = Array.from(index.keys()).sort();

  for(const filePath of sortedPaths){
    const { mode, sha } = index.get(filePath)!;
    lines.push(`${mode} ${filePath} ${sha}`)
  }

  fs.writeFileSync(INDEX_FILE_PATH, lines.join("\n"));
  return;
}


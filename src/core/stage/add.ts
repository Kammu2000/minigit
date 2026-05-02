import path from 'path';
import fs from 'fs';
import { getFileHash } from '../object/getFileHash.js';
import { readIndex, writeIndex } from './index.js';
import { MODE } from '../../common/constants.js';

const addFile = (filePath: string, root: string): void => {
  const index = readIndex();
  const relativePath = path.relative(root, filePath);

  if(index.has(relativePath)){
    index.delete(relativePath);
  }

  if(fs.existsSync(filePath)){
    const sha = getFileHash(filePath, { write: true });
    index.set(relativePath, { mode: MODE.BLOB, sha });
  }

  writeIndex(index);
  return;
}

const addFolder = (folderPath: string, root: string): void => {
  for (const entityName of fs.readdirSync(folderPath)) {
    const p = path.join(folderPath, entityName);
    
    if(fs.statSync(p).isDirectory()){
      addFolder(p, root);
    }
    else addFile(p, root);
  }

  return;
}

export const add = (paths: string[]): void => {
  const root = process.cwd();
  
  for(const relativePath of paths){
    console.log(relativePath);

    const entityPath = path.join(root, relativePath);
    const stats = fs.statSync(entityPath);

    if(stats.isDirectory()){
      addFolder(entityPath, root);  
    }
    else if(stats.isFile()){
      addFile(entityPath, root);
    }
  } 
}


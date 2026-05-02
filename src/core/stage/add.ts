import path from 'path';
import fs from 'fs';
import { getFileHash } from '../object/getFileHash.js';
import { readIndex, writeIndex } from './index.js';
import { MODE } from '../../common/constants.js';

const addFile = (filePath: string): void => {
  if(!fs.existsSync(filePath)){
    throw new Error("Not a valid file path");
  }

  const sha = getFileHash(filePath, { write: true });
  const index = readIndex();

  index.set(filePath, { mode: MODE.BLOB, sha });
  writeIndex(index);
  return;
}

const addFolder = (folderPath: string): void => {
  for (const entityName of fs.readdirSync(folderPath)) {
    const p = path.join(folderPath, entityName);
    
    if(fs.statSync(p).isDirectory()){
      addFolder(p);
    }
    else addFile(p);
  }

  return;
}

export const add = (paths: string[]): void => {
  for(const entityPath of paths){
    const stats = fs.statSync(entityPath);
    const absoluteEntityPath = path.join(process.cwd(), entityPath);

    if(stats.isDirectory()){
      addFolder(absoluteEntityPath);  
    }
    else if(stats.isFile()){
      addFile(absoluteEntityPath);
    }
  } 
}


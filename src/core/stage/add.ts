import path from 'path';
import fs from 'fs';
import { getFileHash } from '../object/getFileHash.js';
import { readIndex, writeIndex } from './index.js';
import { getIgnoredPatterns, isIgnored } from '../../common/utils.js';
import { MODE } from '../../common/constants.js';

const addFile = (filePath: string, root: string, ignoredPatterns: string[]): void => {
  const relativePath = path.relative(root, filePath);
  if(isIgnored(relativePath, ignoredPatterns)) return;

  const index = readIndex();

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

const addFolder = (folderPath: string, root: string, ignoredPatterns: string[]): void => {
  for (const entityName of fs.readdirSync(folderPath)) {
    const p = path.join(folderPath, entityName);
    const relativePath = path.relative(root, folderPath);

    if(isIgnored(relativePath, ignoredPatterns)) continue;

    if(fs.statSync(p).isDirectory()){
      addFolder(p, root, ignoredPatterns);
    }
    else addFile(p, root, ignoredPatterns);
  }

  return;
}

export const add = (paths: string[]): void => {
  const root = process.cwd();
  const ignoredPatterns = getIgnoredPatterns(root);
  
  for(const relativePath of paths){
    const entityPath = path.join(root, relativePath);
    const stats = fs.statSync(entityPath);
    
    if(isIgnored(relativePath, ignoredPatterns)) continue;

    if(stats.isDirectory()){
      addFolder(entityPath, root, ignoredPatterns);  
    }
    else if(stats.isFile()){
      addFile(entityPath, root, ignoredPatterns);
    }
  } 
}


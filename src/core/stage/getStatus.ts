import { readdirSync, statSync } from "fs";
import path from 'path';
import { readIndex } from "./index.js";
import { getIgnoredPatterns, isIgnored } from "../../common/utils.js";
import { getHeadMap } from "../commit/utils.js";
import { getFileHash } from "../object/getFileHash.js";
import { FileStatus, FileSubStatus, StatusVsFilesMap } from "../../common/types.js";

const collectWorkingFiles = (folderPath: string, root: string, files: Set<string>, ignoredPatterns: string[]): void => {
  for(const entityName of readdirSync(folderPath)){
    const entityPath = path.join(folderPath, entityName);
    const relativePath = path.relative(root, entityPath);

    if(isIgnored(relativePath, ignoredPatterns)) continue;

    const stats = statSync(entityPath);

    if(stats.isDirectory()){
      collectWorkingFiles(entityPath, root, files, ignoredPatterns);
    }
    else files.add(relativePath);
  }

  return;
};

export const getStatus = (root: string): StatusVsFilesMap => {
  const ignoredPatterns = getIgnoredPatterns(root);
  const workingFiles = new Set<string>();
  collectWorkingFiles(root, root, workingFiles, ignoredPatterns);

  const index = readIndex();
  const headMap = getHeadMap();

  const statusVsFilesMap: StatusVsFilesMap = {
    WORKING_DIR: [],
    STAGED: [],
    UNTRACKED: []
  };

  const allFiles = new Set([...workingFiles, ...index.keys(), ...headMap.keys()]);

  for(const filePath of allFiles){
    // case-1: file is not in index but present in workingFiles
    if(!index.has(filePath) && workingFiles.has(filePath)){
      statusVsFilesMap[FileStatus.UNTRACKED].push([FileSubStatus.UNTRACKED, filePath]);
    }

    // case-2: file is present in index but not in workingFiles
    if(index.has(filePath) && !workingFiles.has(filePath)){
      statusVsFilesMap[FileStatus.WORKING_DIR].push([FileSubStatus.DELETED, filePath]);
    }

    // case-3: file is present in index and in workingFiles but sha is different
    if(index.has(filePath) && workingFiles.has(filePath)){
      const fileSha = getFileHash(filePath);

      if(index.get(filePath)?.sha != fileSha){
        statusVsFilesMap[FileStatus.WORKING_DIR].push([FileSubStatus.MODIFIED, filePath]);
      }
    }

    // case-4: file is not present in headMap but present in index
    if(!headMap.has(filePath) && index.has(filePath)){
      statusVsFilesMap[FileStatus.STAGED].push([FileSubStatus.NEW_FILE, filePath]);
    }

    // case-5: file is present in headMap but not in workingFiles and index
    if(headMap.has(filePath) && !index.has(filePath) && !workingFiles.has(filePath)){
      statusVsFilesMap[FileStatus.STAGED].push([FileSubStatus.DELETED, filePath]);
    }
  }

  return statusVsFilesMap; 
};


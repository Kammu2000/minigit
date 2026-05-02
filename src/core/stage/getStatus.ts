import { readdirSync, statSync } from "fs";
import path from 'path';
import { getFileHash } from "../object/getFileHash.js";
import { readIndex } from "./index.js";
import { EMPTY_OBJECT_READONLY } from "../../common/constants.js";
import { FileStatus, IndexMap, StatusVsFilesMap, TreeEntry, HashId } from "../../common/types.js";

const getFileStatus = (filePath: string, index: IndexMap): FileStatus => {
  const fileSha = getFileHash(filePath);
  const { mode:_, sha } = index.get(filePath) ?? EMPTY_OBJECT_READONLY as { mode: TreeEntry['mode'], sha: HashId };

  if(sha){
    if(sha === fileSha)
      return FileStatus.STAGED;

    if(sha !== fileSha)
      return FileStatus.MODIFIED;
  }

  return FileStatus.UNTRACKED;
};

const collectWorkingFiles = (folderPath: string, root: string, files: Set<string>): void => {
  for(const entityName of readdirSync(folderPath)){
    const entityPath = path.join(folderPath, entityName);
    const relativePath = path.relative(root, entityPath);
    const stats = statSync(entityPath);

    if(stats.isDirectory()){
      collectWorkingFiles(entityPath, root, files);
    }
    else files.add(relativePath);
  }

  return ;
};

export const getStatus = (root: string): StatusVsFilesMap => {
  const workingFiles = new Set<string>();
  collectWorkingFiles(root, root, workingFiles);

  const index = readIndex();

  const statusVsFiles: StatusVsFilesMap = {
    [FileStatus.MODIFIED]: [],
    [FileStatus.STAGED]: [],
    [FileStatus.DELETED]: [],
    [FileStatus.UNTRACKED]: [],
  };

  for(const filePath of workingFiles){
      const fileStatus = getFileStatus(filePath, index);
      statusVsFiles[fileStatus].push(filePath);
  }

  for(const filePath of index.keys()){
    if(workingFiles.has(filePath))
      continue;

    statusVsFiles[FileStatus.DELETED].push(filePath);
  }

  return statusVsFiles;
};

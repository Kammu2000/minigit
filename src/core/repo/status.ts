import { readIndex } from "../index/index.js";
import { getIgnoredPatterns } from "../../common/utils/ignoreFileUtils.js";
import { computeHeadMap } from "../../common/utils/headUtils.js";
import {
  FileStatus,
  FileSubStatus,
  StatusVsFilesMap,
} from "../../common/types.js";
import { computeWorkTreeMap } from "../../common/utils/workTreeUtils.js";

export const getStatus = (root: string): StatusVsFilesMap => {
  const ignoredPatterns = getIgnoredPatterns(root);
  const workTreeMap = new Map();
  computeWorkTreeMap(root, root, workTreeMap, ignoredPatterns);

  const index = readIndex();
  const headMap = computeHeadMap();

  const statusVsFilesMap: StatusVsFilesMap = {
    WORKING_DIR: [],
    STAGED: [],
    UNTRACKED: [],
  };

  const allFiles = new Set([
    ...workTreeMap.keys(),
    ...index.keys(),
    ...headMap.keys(),
  ]);

  for (const filePath of allFiles) {
    // case-1: file is not in index but present in workingFiles
    if (!index.has(filePath) && workTreeMap.has(filePath)) {
      statusVsFilesMap[FileStatus.UNTRACKED].push([
        FileSubStatus.UNTRACKED,
        filePath,
      ]);
    }

    // case-2: file is present in index but not in workingFiles
    if (index.has(filePath) && !workTreeMap.has(filePath)) {
      statusVsFilesMap[FileStatus.WORKING_DIR].push([
        FileSubStatus.DELETED,
        filePath,
      ]);
    }

    // case-3: file is present in index and in workingFiles but sha is different
    if (index.has(filePath) && workTreeMap.has(filePath)) {
      const fileSha = workTreeMap.get(filePath);

      if (index.get(filePath)?.sha != fileSha) {
        statusVsFilesMap[FileStatus.WORKING_DIR].push([
          FileSubStatus.MODIFIED,
          filePath,
        ]);
      }
    }

    // case-4: file is not present in headMap but present in index
    if (!headMap.has(filePath) && index.has(filePath)) {
      statusVsFilesMap[FileStatus.STAGED].push([
        FileSubStatus.NEW_FILE,
        filePath,
      ]);
    }

    // case-5: file is present in headMap but not in workingFiles and index
    if (
      headMap.has(filePath) &&
      !index.has(filePath) &&
      !workTreeMap.has(filePath)
    ) {
      statusVsFilesMap[FileStatus.STAGED].push([
        FileSubStatus.DELETED,
        filePath,
      ]);
    }

    // case-6: file is present in headMap and in index but hash is different
    if (
      headMap.has(filePath) &&
      index.has(filePath) &&
      headMap.get(filePath) != index.get(filePath)?.sha
    ) {
      statusVsFilesMap[FileStatus.STAGED].push([
        FileSubStatus.MODIFIED,
        filePath,
      ]);
    }
  }

  return statusVsFilesMap;
};

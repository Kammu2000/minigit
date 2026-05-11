import { readFileSync } from "fs";
import { getIgnoredPatterns } from "../../common/utils/ignoreFileUtils.js";
import { computeWorkTreeMap } from "../../common/utils/workTreeUtils.js";
import { readIndex } from "../stage/index.js";
import { computeDiff } from "./diffAlgo.js";
import { readObject } from "../object/readObject.js";
import { HashId } from "../../common/types.js";
import logger from "../../common/helpers/logger.js";

export const getFileLines = (sha: HashId): string[] => {
  const { body } = readObject(sha);
  const lines = body.toString("utf8").split("\n");
  return lines;
};

export const computeIndexVsWorkDiff = (): void => {
  const root = process.cwd();
  const ignoredPatterns = getIgnoredPatterns(root);
  const workTreeMap = new Map();

  const index = readIndex();
  computeWorkTreeMap(root, root, workTreeMap, ignoredPatterns);

  const allFiles = new Set([...workTreeMap.keys(), ...index.keys()]);

  for (const filePath of allFiles) {
    let oldLines: string[];
    let newLines: string[];

    // case-1: new file for index (not shown in diff)
    // if (!index.has(filePath) && workTreeMap.has(filePath)) {
    //   oldLines = [];
    //   newLines = readFileSync(filePath, "utf8").split("\n");
    // }

    // case-2: deleted file
    if (index.has(filePath) && !workTreeMap.has(filePath)) {
      const { sha } = index.get(filePath)!;
      oldLines = getFileLines(sha);
      newLines = [];
    }

    // case-3: modified file in working directory
    else if (
      index.has(filePath) &&
      workTreeMap.has(filePath) &&
      index.get(filePath)?.sha != workTreeMap.get(filePath)
    ) {
      const { sha } = index.get(filePath)!;
      oldLines = getFileLines(sha);
      newLines = readFileSync(filePath, "utf8").split("\n");
    }

    // case-4: unchanged file
    else {
      continue;
    }

    const edits = computeDiff(oldLines, newLines);
    logger.logDiff(filePath, edits);
  }
};

import { readFileSync } from "fs";
import { readIndex } from "../index/index.js";
import { computeDiff } from "./computeDiff.js";
import { readObject } from "../object/readObject.js";
import { getIgnoredPatterns } from "../repo/ignoreFileUtils.js";
import { computeWorkTreeMap } from "../tree/utils.js";
import { FileDiff, HashId } from "../../common/types.js";

export const getFileLines = (sha: HashId): string[] => {
  const { body } = readObject(sha);
  const lines = body.toString("utf8").split("\n");
  return lines;
};

export const computeIndexVsWorkDiff = (): FileDiff[] => {
  const root = process.cwd();
  const ignoredPatterns = getIgnoredPatterns(root);
  const workTreeMap = new Map();

  const index = readIndex();
  computeWorkTreeMap(root, root, workTreeMap, ignoredPatterns);

  const diffs: FileDiff[] = [];
  const allFiles = new Set([...workTreeMap.keys(), ...index.keys()]);

  for (const filePath of allFiles) {
    let oldLines: string[];
    let newLines: string[];

    // case-1: deleted file
    if (index.has(filePath) && !workTreeMap.has(filePath)) {
      const { sha } = index.get(filePath)!;
      oldLines = getFileLines(sha);
      newLines = [];
    }

    // case-2: modified file in working directory
    else if (
      index.has(filePath) &&
      workTreeMap.has(filePath) &&
      index.get(filePath)?.sha != workTreeMap.get(filePath)
    ) {
      const { sha } = index.get(filePath)!;
      oldLines = getFileLines(sha);
      newLines = readFileSync(filePath, "utf8").split("\n");
    }

    // case-3: unchanged file
    else {
      continue;
    }

    const edits = computeDiff(oldLines, newLines);
    diffs.push({ filePath, edits });
  }

  return diffs;
};

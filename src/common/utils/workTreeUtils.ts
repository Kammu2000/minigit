import path from "path";
import { readdirSync, statSync } from "fs";
import { isIgnored } from "./ignoreFileUtils.js";
import { getFileHash } from "../../core/object/getFileHash.js";
import { HashId } from "../../common/types.js";

export const computeWorkTreeMap = (
  currentDir: string,
  root: string,
  workTreeMap: Map<string, HashId>,
  ignoredPatterns: string[],
): void => {
  for (const entityName of readdirSync(currentDir)) {
    const entityPath = path.join(currentDir, entityName);
    const relativePath = path.relative(root, entityPath);

    if (isIgnored(relativePath, ignoredPatterns)) continue;

    const stats = statSync(entityPath);

    if (stats.isDirectory()) {
      computeWorkTreeMap(entityPath, root, workTreeMap, ignoredPatterns);
    } else {
      const hashId = getFileHash(entityPath);
      workTreeMap.set(relativePath, hashId);
    }
  }

  return;
};

import path, { dirname } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { readObject } from "../../core/object/readObject.js";
import { decodeTreeObject } from "../../core/tree/decodeTree.js";
import { MODE } from "../../common/constants.js";
import { HashId, HeadpMap } from "../../common/types.js";

export const getHeadContent = (root: string): string | null => {
  const headPath = path.join(root, ".minigit/HEAD");
  if (!existsSync(headPath)) return null;

  return readFileSync(headPath, "utf8").trim();
};

export const getHeadCommit = (): HashId | null => {
  const root = process.cwd();
  const headContent = getHeadContent(root);

  if (!headContent) return null;

  // case-1: when user is on a branch
  if (headContent.startsWith("ref:")) {
    const refPath = headContent.split(" ")[1];
    if (!refPath) return null;

    const absoluteRefPath = path.join(root, `.minigit/${refPath}`);
    if (!existsSync(absoluteRefPath)) return null;

    return readFileSync(absoluteRefPath, "utf8").trim() || null;
  }

  // case-2: detached head (user switched to a commit in history)
  return headContent || null;
};

export const updateHead = (commitId: HashId): void => {
  const root = process.cwd();
  const headContent = getHeadContent(root);

  if (!headContent) return;

  // case-1
  if (headContent.startsWith("ref:")) {
    const refPath = headContent.split(" ")[1];
    if (!refPath) return;

    const absoluteRefPath = path.join(root, `.minigit/${refPath}`);

    mkdirSync(dirname(absoluteRefPath), { recursive: true });
    writeFileSync(absoluteRefPath, commitId);
    return;
  }

  // case-2
  const headPath = path.join(root, ".minigit/HEAD");
  writeFileSync(headPath, commitId);
  return;
};

const buildHeadMap = (
  treeSha: HashId,
  currentPath: string,
  headMap: HeadpMap,
): void => {
  const { body: treeBody } = readObject(treeSha);

  for (const entry of decodeTreeObject(treeBody)) {
    const updatedPath = currentPath
      ? currentPath + "/" + entry.name
      : entry.name;

    if (entry.mode === MODE.BLOB) {
      headMap.set(updatedPath, entry.sha);
    } else buildHeadMap(entry.sha, updatedPath, headMap);
  }

  return;
};

export const computeHeadMap = (): HeadpMap => {
  const headMap: HeadpMap = new Map();
  const commitId = getHeadCommit();

  if (!commitId) return headMap;

  const { body } = readObject(commitId);
  const lines = body.toString("utf8").split("\n");
  const [treeSha] = lines
    .map((line: string): string | undefined => {
      if (line.trim().startsWith("tree")) return line.split(" ")[1];

      return "";
    })
    .filter(Boolean);

  if (!treeSha) return headMap;

  buildHeadMap(treeSha, "", headMap);
  return headMap;
};

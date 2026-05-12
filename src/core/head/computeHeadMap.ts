import { readObject } from "../object/readObject.js";
import { decodeTreeObject } from "../tree/decodeTree.js";
import { getHeadCommit } from "./utils.js";
import { MODE } from "../../common/constants.js";
import { HashId, HeadpMap } from "../../common/types.js";

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

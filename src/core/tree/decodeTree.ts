import { HASH_ID_LENGTH, MODE_VS_TYPE } from "../../common/constants.js";
import { TreeEntry } from "../../common/types.js";

export const decodeTreeObject = (
  treeBody: Buffer<ArrayBuffer>,
): TreeEntry[] => {
  const entries: TreeEntry[] = [];
  let left = 0;

  while (left < treeBody.length) {
    const spaceIndex = treeBody.indexOf(" ", left);
    const mode = treeBody
      .subarray(left, spaceIndex)
      .toString("utf8") as keyof typeof MODE_VS_TYPE;

    const nullIndex = treeBody.indexOf(0, spaceIndex);
    const name = treeBody.subarray(spaceIndex + 1, nullIndex).toString("utf8");

    const hashId = treeBody
      .subarray(nullIndex + 1, nullIndex + HASH_ID_LENGTH + 1)
      .toString("hex");
    left = nullIndex + HASH_ID_LENGTH + 1;

    entries.push({ mode, name, sha: hashId });
  }

  return entries;
};

import { readIndex } from "../index/index.js";
import { MODE } from "../../common/constants.js";
import { BlobNode, TreeNode } from "../../common/types.js";

export const buildTreeFromIndex = (): TreeNode => {
  const index = readIndex();

  const root: TreeNode = {
    name: "root",
    type: MODE.TREE,
    children: [],
  };

  for (const [filePath, { sha }] of index) {
    const parts = filePath.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        const fileNode: BlobNode = {
          hashId: sha,
          name: part ?? "",
          type: MODE.BLOB,
        };

        current.children.push(fileNode);
        continue;
      }

      // check if folder already exists
      let next = current.children.find(
        (child: TreeNode | BlobNode): boolean =>
          child.type === MODE.TREE && child.name === part,
      ) as TreeNode | undefined;

      // if not → create
      if (!next) {
        next = {
          name: part ?? "",
          type: MODE.TREE,
          children: [],
        };
        current.children.push(next);
      }

      current = next;
    }
  }

  return root;
};

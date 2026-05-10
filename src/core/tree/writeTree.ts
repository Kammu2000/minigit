import crypto from "crypto";
import { encodeTreeObject } from "./encodeTree.js";
import { writeObject } from "../object/writeObject.js";
import { buildTreeFromIndex } from "./buildTree.js";
import { MODE } from "../../common/constants.js";
import { BlobNode, HashId, TreeEntry, TreeNode } from "../../common/types.js";

const isBlob = (node: TreeNode | BlobNode): node is BlobNode => {
  return node.type === MODE.BLOB;
};

// merkle tree traversal
const getTreeHash = (root: TreeNode): HashId => {
  const entries: TreeEntry[] = [];

  for (const child of root.children) {
    if (isBlob(child)) {
      entries.push({
        mode: MODE.BLOB,
        name: child.name,
        sha: child.hashId,
      });
    } else {
      const sha = getTreeHash(child);
      entries.push({ mode: MODE.TREE, name: child.name, sha });
    }
  }

  entries.sort((a: TreeEntry, b: TreeEntry): number =>
    a.name.localeCompare(b.name),
  );

  const treeObject = encodeTreeObject(entries);
  const treeSha = crypto.createHash("sha1").update(treeObject).digest("hex");

  writeObject(treeObject, treeSha);
  return treeSha;
};

export const writeTreeFromIndex = (): HashId => {
  const root = buildTreeFromIndex();
  return getTreeHash(root);
};

import { readIndex } from "../stage/index.js";
import { MODE } from "../../common/constants.js";
import { BlobNode, TreeNode } from "../../common/types.js";

export const buildTreeFromIndex = (): TreeNode => {
  const index = readIndex();
  const root: TreeNode = {
    name: "root",
    type: MODE.TREE,
    children: []
  };

  for(const [filePath, { mode:_, sha }] of index){
    const parts = filePath.split('/');
    const prev = root;

    for(let i = 0; i < parts.length; i++){
      if(i == parts.length - 1){
        const node: BlobNode = {
          hashId: sha,
          name: parts[i] ?? "",
          type: MODE.BLOB,
        };

        prev.children.push(node);
        continue;
      }

      const node: TreeNode = {
        name: parts[i] ?? "",
        type: MODE.TREE,
        children: []
      };

      prev.children.push(node);
    }
  }

  return root;
};

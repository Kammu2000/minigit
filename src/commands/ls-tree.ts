import { lsTree } from "../core/tree/lsTree.js";
import { HashId } from "../common/types.js";

const lsTreeCommand = (treeHash: HashId): void => {
    lsTree(treeHash);
}

export default lsTreeCommand;

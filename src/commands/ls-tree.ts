import { lsTree } from "../core/tree/lsTree.js";

const lsTreeCommand = (args: string[]): void => {
    const [treeHash] = args;

    if(!treeHash){
      throw new Error("Invalid command");
    }

    lsTree(treeHash);
}

export default lsTreeCommand;

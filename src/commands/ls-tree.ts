import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { lsTree } from "../core/tree/lsTree.js";

const lsTreeCommand = (args: string[]): void => {
    const [treeHash] = args;

    if(!treeHash){
      throw new InvalidCommandError("sha was not passed in command arguments");
    }

    lsTree(treeHash);
}

export default lsTreeCommand;

import { lsTree } from "../core/tree/lsTree.js";
import logger from "../common/helpers/logger.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { Command } from "./types.js";

export class LSTreeCommand implements Command {
  execute(args: string[]): void {
    const [treeHash] = args;

    if (!treeHash) {
      throw new InvalidCommandError("sha was not passed in command arguments");
    }

    const entries = lsTree(treeHash);
    logger.logTree(entries);
  }
}

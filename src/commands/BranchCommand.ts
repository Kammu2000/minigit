import logger from "../common/helpers/logger.js";
import { getBranchList } from "../core/refs/getBranchList.js";
import { getCurrentBranch } from "../core/refs/getCurrentBranch.js";
import { Command } from "./types.js";

export class BranchCommand implements Command {
  execute(_args: string[]): void {
    const branches = getBranchList();
    const currentBranch = getCurrentBranch();

    logger.logBranchList(branches, currentBranch);
  }
}

import { getStatus } from "../core/repo/status.js";
import logger from "../common/helpers/logger.js";
import { FileStatus, StatusVsFilesMap } from "../common/types.js";
import { green, red } from "../common/helpers/colors.js";
import { Command } from "./types.js";

export class StatusCommand implements Command {
  execute(_args: string[]): void {
    const root = process.cwd();
    const statusVsFiles: StatusVsFilesMap = getStatus(root);

    for (const [status, files] of Object.entries(statusVsFiles)) {
      if (!files.length) continue;

      switch (status) {
        case FileStatus.WORKING_DIR: {
          logger.logWithNewLine("Changes not staged for commit: ");
          break;
        }

        case FileStatus.STAGED: {
          logger.logWithNewLine("Changes to be committed: ");
          break;
        }

        case FileStatus.UNTRACKED: {
          logger.logWithNewLine("Untracked files: ");
          break;
        }

        default:
          break;
      }

      const colorWrapper = status === FileStatus.STAGED ? green : red;
      logger.logStatusFiles(files, colorWrapper);
    }
  }
}

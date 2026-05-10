import { getStatus } from "../core/stage/getStatus.js";
import logger from "../common/helpers/logger.js";
import { FileStatus, StatusVsFilesMap } from "../common/types.js";

const statusCommand = (): void => {
  const root = process.cwd();
  const statusVsFiles: StatusVsFilesMap = getStatus(root);

  for (const [status, files] of Object.entries(statusVsFiles)) {
    if (!files.length) continue;

    switch (status) {
      case FileStatus.WORKING_DIR: {
        logger.log("Changes not staged for commit: ", "\n\n");
        break;
      }

      case FileStatus.STAGED: {
        logger.log("Changes to be committed: ", "\n\n");
        break;
      }

      case FileStatus.UNTRACKED: {
        logger.log("Untracked files: ", "\n\n");
        break;
      }

      default:
        break;
    }

    logger.logStatusFiles(files);
  }
};

export default statusCommand;

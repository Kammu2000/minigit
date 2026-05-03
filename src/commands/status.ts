import { getStatus } from "../core/stage/getStatus.js";
import logger from "../common/helpers/logger.js";
import { FileStatus, StatusVsFilesMap } from "../common/types.js";

const printFiles = (prefix: string, files: string[]): void => {
  prefix = prefix ? `${prefix}: `: prefix;
  for(const file of files){
    logger.log(`${prefix}${file}`);
  }
};

const statusCommand = () => {
  const root = process.cwd();
  const statusVsFiles: StatusVsFilesMap = getStatus(root);

  for(const [status, paths] of Object.entries(statusVsFiles)){
    if(!paths.length)
      continue;

    switch (status) {
      case FileStatus.DELETED:
      case FileStatus.MODIFIED: {
        console.log("Changes not staged for commit", "\n");
        const prefix = status === FileStatus.MODIFIED ? "modified": "deleted";
        printFiles(prefix, paths);
        break;
      }

      case FileStatus.STAGED: {
        console.log("Changes to be committed:", "\n");
        printFiles("staged", paths);
        break;
      }
      
      case FileStatus.UNTRACKED: {
        console.log("Untracked files:", "\n");
        printFiles("", paths);
        break;
      }
        
      default:
        break;
    }
  }
}

export default statusCommand;

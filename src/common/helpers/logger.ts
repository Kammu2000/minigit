import { MODE_VS_TYPE } from "../constants.js";
import { TreeEntry, FileSubStatus } from "../types.js";

class Logger {
  log(value: string, followThrough?: string): void {
    process.stdout.write(value);

    if (followThrough) {
      process.stdout.write(followThrough);
    }
  }

  logError(message: string): void {
    process.stderr.write(`${message}\n`);
  }

  logFile(content: string): void {
    this.log(content, "\n");
  }

  logTree(entries: TreeEntry[]): void {
    for (const { mode, name, sha } of entries) {
      this.log(`${mode} ${MODE_VS_TYPE[mode]} ${sha} ${name}`, "\n");
    }
  }

  logBranchList(branches: string[], currentBranch: string | undefined): void {
    for (const branch of branches) {
      if (branch === currentBranch) {
        this.log(`* ${branch}`, "\n");
      } else this.log(branch, "\n");
    }
  }

  logStatusFiles(files: [FileSubStatus, string][]): void {
    for (const file of files) {
      const message = file[0] ? `${file[0]}: ${file[1]}` : file[1];
      this.log(message, "\n");
    }

    this.log("\n");
    return;
  }
}

export default new Logger();

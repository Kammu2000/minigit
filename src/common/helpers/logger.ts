import { MODE_VS_TYPE, COLORS } from "../constants.js";
import { TreeEntry, FileSubStatus, Edit, ColorWrapperFn } from "../types.js";
import { green, red } from "./colors.js";

class Logger {
  log(value: string): void {
    process.stdout.write(value);
  }

  logWithNewLine(value: string): void {
    this.log(value);
    process.stdout.write("\n");
  }

  logError(message: string): void {
    process.stderr.write(`${message}\n`);
  }

  logFile(content: string): void {
    this.logWithNewLine(content);
  }

  logTree(entries: TreeEntry[]): void {
    for (const { mode, name, sha } of entries) {
      this.log(`${mode} ${MODE_VS_TYPE[mode]} ${sha} ${name}`);
    }
  }

  logBranchList(branches: string[], currentBranch: string | undefined): void {
    for (const branch of branches) {
      if (branch === currentBranch) {
        const line = green(`* ${branch}`);
        this.logWithNewLine(line);
      } else this.logWithNewLine(branch);
    }
  }

  logStatusFiles(
    files: [FileSubStatus, string][],
    colorWrapper: ColorWrapperFn,
  ): void {
    this.log("\n");

    for (const file of files) {
      const line = file[0] ? `${file[0]}: ${file[1]}` : file[1];
      this.logWithNewLine(colorWrapper(line));
    }

    this.log("\n");
    return;
  }

  logDiff(filePath: string, edits: Edit[]): void {
    this.logWithNewLine(
      `${COLORS.BOLD}diff --git a/${filePath} b/${filePath}${COLORS.RESET}`,
    );
    this.logWithNewLine(`${COLORS.RED}--- a/${filePath}${COLORS.RESET}`);
    this.logWithNewLine(`${COLORS.GREEN}+++ b/${filePath}${COLORS.RESET}`);
    this.logWithNewLine("\n");

    for (const edit of edits) {
      if (edit.type === "equal") {
        const line = ` ${edit.content}`;
        this.logWithNewLine(line);
      } else if (edit.type === "deleted") {
        const line = red(`-${edit.content}`);
        this.logWithNewLine(line);
      } else if (edit.type === "inserted") {
        const line = green(`+${edit.content}`);
        this.logWithNewLine(line);
      }
    }
  }
}

export default new Logger();

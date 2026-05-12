import { computeIndexVsWorkDiff } from "../core/diff/computeIndexVsWorkDiff.js";
import logger from "../common/helpers/logger.js";
import { Command } from "./types.js";

export class DiffCommand implements Command {
  execute(args: string[]): void {
    const [flag] = args;

    if (!flag) {
      const diffs = computeIndexVsWorkDiff();

      for (const diff of diffs) {
        const { filePath, edits } = diff;
        logger.logDiff(filePath, edits);
      }
    }
  }
}

import { writeTreeFromIndex } from "../core/tree/writeTree.js";
import logger from "../common/helpers/logger.js";
import { Command } from "./types.js";

export class WriteTreeCommand implements Command {
  execute(_args: string[]): void {
    const treeSha = writeTreeFromIndex();
    logger.logWithNewLine(`${treeSha}`);
  }
}

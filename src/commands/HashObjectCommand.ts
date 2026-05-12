import { getFileHash } from "../core/object/getFileHash.js";
import logger from "../common/helpers/logger.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { Command } from "./types.js";

export class HashObjectCommand implements Command {
  execute(args: string[]): void {
    const [filePath, flag] = args;

    if (!filePath) {
      throw new InvalidCommandError(
        "please pass a file path in command arguments",
      );
    }

    const hashId = getFileHash(filePath, {
      write: flag === "-w" ? true : false,
    });

    logger.logWithNewLine(hashId);
  }
}

import { readObject } from "../core/object/readObject.js";
import logger from "../common/helpers/logger.js";
import { decodeTreeObject } from "../core/tree/decodeTree.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { ObjectCorruptedError } from "../common/helpers/errors/object.js";
import { Command } from "./types.js";

export class CatFileCommand implements Command {
  execute(args: string[]): void {
    const [flag, hashId] = args;

    if (!flag || !hashId) {
      const errorMessage = !flag
        ? "Flag was not passed to the command"
        : "Object sha was not passed to the command";
      throw new InvalidCommandError(errorMessage);
    }

    const { type, body } = readObject(hashId);

    if (flag === "-t") {
      logger.logWithNewLine(type);
      return;
    }

    if (flag === "-p") {
      switch (type) {
        case "blob": {
          const content = body.toString("utf8");
          logger.logFile(content);
          return;
        }

        case "tree": {
          const entries = decodeTreeObject(body);
          logger.logTree(entries);
          return;
        }

        case "commit": {
          const content = body.toString("utf8");
          logger.logWithNewLine(content);
          return;
        }

        default: {
          throw new ObjectCorruptedError(hashId);
        }
      }
    }

    throw new InvalidCommandError(`${flag} flag does not exist on command`);
  }
}

import { readObject } from "./readObject.js";
import logger from "../../common/helpers/logger.js";
import { decodeTreeObject } from "../tree/decodeTree.js";
import { HashId } from "../../common/types.js";
import { ObjectCorruptedError } from "../../common/helpers/errors/object.js";
import { InvalidCommandError } from "../../common/helpers/errors/minigit.js";

export const logObjectInfo = (flag: string, hashId: HashId): void => {
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
};

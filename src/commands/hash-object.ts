import { getFileHash } from "../core/object/getFileHash.js";
import logger from "../common/helpers/logger.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { HashId } from "../common/types.js";

const hashObjectCommand = (args: string[]): HashId => {
  const [filePath, flag] = args;

  if (!filePath) {
    throw new InvalidCommandError(
      "please pass a file path in command arguments",
    );
  }

  const hashId = getFileHash(filePath, {
    write: flag === "-w" ? true : false,
  });

  logger.log(hashId, "\n");
  return hashId;
};

export default hashObjectCommand;

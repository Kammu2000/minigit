import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { logObjectInfo } from "../core/object/logObjectInfo.js";

const catFileCommand = (args: string[]): void => {
  const [flag, hashId] = args;

  if (!flag) {
    throw new InvalidCommandError("Flag was not passed to the command");
  }

  if (!hashId) {
    throw new InvalidCommandError("Object sha was not passed to the command");
  }

  logObjectInfo(flag, hashId);
};

export default catFileCommand;

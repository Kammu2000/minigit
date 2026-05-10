import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { removeFileFromIndex } from "../core/stage/remove.js";

const restoreCommand = (args: string[]): void => {
  const [filePath] = args;

  if (!filePath) {
    throw new InvalidCommandError(
      "please pass a file path in command arguments",
    );
  }

  removeFileFromIndex(filePath);
  return;
};

export default restoreCommand;

import { removeFileFromIndex } from "../core/index/remove.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import { Command } from "./types.js";

export class RestoreCommand implements Command {
  execute(args: string[]): void {
    const [filePath] = args;

    if (!filePath) {
      throw new InvalidCommandError(
        "please pass a file path in command arguments",
      );
    }

    removeFileFromIndex(filePath);
  }
}

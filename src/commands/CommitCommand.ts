import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import logger from "../common/helpers/logger.js";
import { commit } from "../core/commit/commit.js";
import { Command } from "./types.js";

export class CommitCommand implements Command {
  execute(args: string[]): void {
    const [flag, message] = args;

    if (!flag || flag !== "-m" || !message) {
      throw new InvalidCommandError(
        "please provide -m flag along with commit message to commit your changes",
      );
    }

    const commitId = commit(message);
    logger.logWithNewLine(`Committed changes with commit Id: ${commitId}`);
  }
}

import { init } from "../core/repo/init.js";
import logger from "../common/helpers/logger.js";
import { Command } from "./types.js";

export class InitCommand implements Command {
  execute(_args: string[]): void {
    init();
    logger.log(`Initialized empty minigit repository`);
  }
}

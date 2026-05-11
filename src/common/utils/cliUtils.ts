import logger from "../helpers/logger.js";
import { CLIInput } from "../types.js";

export const parseCLI = (): CLIInput => {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    logger.logError("No command specified");
    process.exit(1);
  }

  return { command, args };
};

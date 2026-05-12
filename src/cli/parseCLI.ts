import logger from "../common/helpers/logger.js";

type CLIInput = {
  command: string;
  args: string[];
};

export const parseCLI = (): CLIInput => {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    logger.logError("No command specified");
    process.exit(1);
  }

  return { command, args };
};

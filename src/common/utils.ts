type CLIInput = {
  command: string;
  args: string[];
};

export const parseCLI = (): CLIInput => {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    console.error("No command specified");
    process.exit(1);
  }

  return { command, args };
};

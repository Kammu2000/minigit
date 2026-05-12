import { Command } from "../commands/types.js";
import { AddCommand } from "../commands/AddCommand.js";
import { BranchCommand } from "../commands/BranchCommand.js";
import { CatFileCommand } from "../commands/CatFileCommand.js";
import { CommitCommand } from "../commands/CommitCommand.js";
import { DiffCommand } from "../commands/DiffCommand.js";
import { HashObjectCommand } from "../commands/HashObjectCommand.js";
import { InitCommand } from "../commands/InitCommand.js";
import { LogCommand } from "../commands/LogCommand.js";
import { LSTreeCommand } from "../commands/LSTreeCommand.js";
import { RestoreCommand } from "../commands/RestoreCommand.js";
import { StatusCommand } from "../commands/StatusCommand.js";
import { WriteTreeCommand } from "../commands/WriteTreeCommand.js";
import { InvalidCommandError } from "../common/helpers/errors/minigit.js";

const registry = new Map<string, Command>([
  ["add", new AddCommand()],
  ["branch", new BranchCommand()],
  ["cat-file", new CatFileCommand()],
  ["commit", new CommitCommand()],
  ["diff", new DiffCommand()],
  ["hash-object", new HashObjectCommand()],
  ["init", new InitCommand()],
  ["log", new LogCommand()],
  ["ls-tree", new LSTreeCommand()],
  ["restore", new RestoreCommand()],
  ["status", new StatusCommand()],
  ["write-tree", new WriteTreeCommand()],
]);

export const getCommand = (name: string): Command => {
  const command = registry.get(name);
  if (command) return command;

  throw new InvalidCommandError(`unknown command: ${name}`);
};

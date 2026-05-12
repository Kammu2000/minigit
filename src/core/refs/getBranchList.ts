import { existsSync, readdirSync } from "fs";
import path from "path";
import { MinigitPathNotFoundError } from "../../common/helpers/errors/minigit.js";

export const getBranchList = (): string[] => {
  const branches: string[] = [];
  const root = process.cwd();
  const headsPath = path.join(root, ".minigit/refs/heads");

  if (!existsSync(headsPath)) {
    throw new MinigitPathNotFoundError(
      ".minigit/refs/heads directory is missing to track branches",
    );
  }

  for (const branch of readdirSync(headsPath)) {
    branches.push(branch);
  }

  return branches;
};

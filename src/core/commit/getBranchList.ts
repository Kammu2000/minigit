import { existsSync, readdirSync } from 'fs';
import path from 'path';

export const getBranchList = (): string[] => {
  const branches: string[] = [];
  const root = process.cwd();
  const headsPath = path.join(root, ".minigit/refs/heads");

  if(!existsSync(headsPath)){
    throw new Error("refs/heads directory does not exist to track branches");
  }

  for (const branch of readdirSync(headsPath)) {
    branches.push(branch); 
  }

  return branches;
}

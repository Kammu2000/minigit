import path from 'path';
import { readFileSync } from 'fs';
import { CLIInput } from './types.js';

export const parseCLI = (): CLIInput => {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    console.error("No command specified");
    process.exit(1);
  }

  return { command, args };
};

export const getIgnoredPatterns = (root: string): string[] => {
  const ignoreFilePath = path.join(root, ".minigitIgnore");
  const patterns = readFileSync(ignoreFilePath, "utf-8")
    .split("\n")
    .map((line: string): string => line.trim())
    .filter((line: string): boolean => Boolean(line && !line.startsWith("#"))); // remove empty + comments

  patterns.push(".minigit/");
  return patterns;
};


export const isIgnored = (entityPath: string, patterns: string[]): boolean => patterns.some((pattern: string): boolean => {

    if(pattern.endsWith("/")){
      return entityPath.startsWith(pattern.slice(0, -1));
    }

    if(pattern.startsWith("*.")){
      return entityPath.endsWith(pattern.slice(1));
    }

    return entityPath === pattern;
});

import path, { dirname } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { HashId } from "../../common/types.js";

export const getHeadCommit = (): HashId | null => {
  const root = process.cwd();
  const headPath = path.join(root, ".minigit/HEAD");

  if(!existsSync(headPath)) return null;

  const headContent = readFileSync(headPath, "utf8").trim();

  // case-1: when user is on a branch
  if(headContent.startsWith("ref:")){
    const refPath = headContent.split(" ")[1];
    if(!refPath) return null;

    const absoluteRefPath = path.join(root, `.minigit/${refPath}`);
    if(!existsSync(absoluteRefPath)) return null;

    return readFileSync(absoluteRefPath, "utf8").trim() || null;
  }

  // case-2: detached head (user switched to a commit in history)
  return headContent || null;
};

export const updateHead = (commitId: HashId): void => {
  const root = process.cwd();
  const headPath = path.join(root, ".minigit/HEAD");

  if(!existsSync(headPath)) return;

  const headContent = readFileSync(headPath, "utf8").trim();
  
  // case-1
  if(headContent.startsWith("ref:")){
    const refPath = headContent.split(" ")[1];
    if(!refPath) return;

    const absoluteRefPath = path.join(root, `.minigit/${refPath}`);

    mkdirSync(dirname(absoluteRefPath), { recursive: true });
    writeFileSync(absoluteRefPath, commitId);
    return; 
  }

  // case-2
  writeFileSync(headPath, commitId);
  return;
};

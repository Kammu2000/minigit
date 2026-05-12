import fs from "fs";
import path from "path";
import { RepositoryAlreadyInitializedError } from "../../common/helpers/errors/minigit.js";

export const init = (): void => {
  const minigit = path.join(process.cwd(), ".minigit");

  if (fs.existsSync(minigit)) {
    throw new RepositoryAlreadyInitializedError();
  }

  const objects = path.join(minigit, "objects");
  const refs = path.join(minigit, "refs");
  const heads = path.join(minigit, "refs/heads");

  fs.mkdirSync(minigit, { recursive: true });
  fs.mkdirSync(objects, { recursive: true });
  fs.mkdirSync(refs, { recursive: true });
  fs.mkdirSync(heads, { recursive: true });

  fs.writeFileSync(path.join(minigit, "HEAD"), "ref: refs/heads/main\n");
  fs.writeFileSync(path.join(heads, "main"), "");
  return;
};

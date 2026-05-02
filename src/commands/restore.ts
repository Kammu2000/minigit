import { removeFileFromIndex } from "../core/stage/remove.js";

const restoreCommand = (args: string[]): void => {
  const [filePath] = args;

  if(!filePath){
    throw new Error("Invalid command");
  }

  removeFileFromIndex(filePath);
  return;
}

export default restoreCommand;

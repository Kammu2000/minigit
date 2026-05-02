import { removeFileFromIndex } from "../core/stage/remove.js";

const restoreCommand = (filePath: string): void => {
  removeFileFromIndex(filePath);
  return;
}

export default restoreCommand;

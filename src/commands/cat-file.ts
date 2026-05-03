import { getFileContent } from '../core/object/getFileContent.js';

const catFileCommand = (args: string[]): void => {
  const [flag, hashId] = args;

  if(!flag || !hashId){
    throw new Error("Invalid command");
  }

  getFileContent(flag, hashId);
}

export default catFileCommand;

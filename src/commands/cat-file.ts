import { logObjectInfo } from '../core/object/logObjectInfo.js';

const catFileCommand = (args: string[]): void => {
  const [flag, hashId] = args;

  if(!flag || !hashId){
    throw new Error("Invalid command");
  }

  logObjectInfo(flag, hashId);
}

export default catFileCommand;

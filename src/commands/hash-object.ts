import { getFileHash } from "../core/object/getFileHash.js";
import logger from "../common/helpers/logger.js";
import { HashId } from "../common/types.js";

const hashObjectCommand = (args: string[]): HashId => {
  const [filePath, flag] = args;

  if(!filePath){
    throw new Error("Invalid command");
  }
  
  const hashId = getFileHash(filePath, { write: flag === "-w" ? true: false });

  logger.log(hashId);
  return hashId;
}

export default hashObjectCommand;

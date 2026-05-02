import { getFileHash } from "../core/object/getFileHash.js";
import { HashId } from "../common/types.js";

const hashObjectCommand = (args: string[]): HashId => {
  const [flag, filePath] = args;

  if(!filePath || !flag || flag != "-w"){
    throw new Error("Invalid command");
  }
  
  const hashId = getFileHash(filePath, { write: true });

  console.log(hashId);
  return hashId;
}

export default hashObjectCommand;

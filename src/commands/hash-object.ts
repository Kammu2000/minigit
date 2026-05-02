import { getFileHash } from "../core/object/getFileHash.js";
import { HashId, HashOptions } from "../common/types.js";

const hashObjectCommand = (filePath: string, options: HashOptions): HashId => {
  const hashId = getFileHash(filePath, options);

  console.log(hashId);
  return hashId;
}

export default hashObjectCommand;

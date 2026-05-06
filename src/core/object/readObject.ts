import path from "path";
import zlib from 'zlib';
import { existsSync, readFileSync } from "fs";
import { MinigitPathNotFoundError } from "../../common/helpers/errors/minigit.js";
import { HashId, ParsedObject } from "../../common/types.js";
import { ObjectCorruptedError, ObjectNotFoundError } from "../../common/helpers/errors/object.js";

export const readObject = (hashId: HashId): ParsedObject => {
  const root = process.cwd();
  const objectsDir = path.join(root, ".minigit/objects"); 
    
  if(!existsSync(objectsDir)){
    throw new MinigitPathNotFoundError(".minigit/objects directory was not found");
  }

  const folderName = hashId.slice(0, 2);
  const fileName = hashId.slice(2);
  const filePath = path.join(objectsDir, folderName, fileName);

  if(!existsSync(filePath)){
    throw new ObjectNotFoundError(hashId);
  }

  const compressedBuffer = readFileSync(filePath);
  const buffer = zlib.inflateSync(compressedBuffer);

  const nullIndex = buffer.indexOf(0);
  const header = buffer.subarray(0, nullIndex);
  const [type, size] = header.toString("utf8").split(" ");

  if(!type || !size){
    throw new ObjectCorruptedError(hashId);
  }

  const body = buffer.subarray(nullIndex + 1);

  return {
    type,
    size: Number(size),
    body
  };
}

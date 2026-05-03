import path from "path";
import zlib from 'zlib';
import { existsSync, readFileSync } from "fs";
import { HashId, ParsedObject } from "../../common/types.js";

export const readObject = (hashId: HashId): ParsedObject => {
  const root = process.cwd();
  const objectsDir = path.join(root, ".minigit/objects"); 
    
  if(!existsSync(objectsDir)){
    throw new Error("Objects directory does not exist");
  }

  const folderName = hashId.slice(0, 2);
  const fileName = hashId.slice(2);
  const filePath = path.join(objectsDir, folderName, fileName);

  if(!existsSync(filePath)){
    throw new Error(`${hashId} object does not exist`);
  }

  const compressedBuffer = readFileSync(filePath);
  const buffer = zlib.inflateSync(compressedBuffer);

  const nullIndex = buffer.indexOf(0);
  const header = buffer.subarray(0, nullIndex);
  const [type, size] = header.toString("utf8").split(" ");

  if(!type || !size){
    throw new Error("Invalid object");
  }

  const body = buffer.subarray(nullIndex + 1);

  return {
    type,
    size: Number(size),
    body
  };
}

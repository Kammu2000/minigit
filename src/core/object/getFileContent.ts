import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { HashId } from '../../common/types';

export const getFileContent = (flag: string, hashId: HashId): Buffer<ArrayBuffer> => {
 if(flag !== "-p"){
    throw new Error("flag is not valid");
  } 

  const objectDir = path.join(process.cwd(), ".minigit/objects", hashId.slice(0, 2));
  const objectFilePath = path.join(objectDir, hashId.slice(2));
  const storedHashId = fs.readFileSync(objectFilePath);
  const blob = zlib.inflateSync(storedHashId);
  const nullIndex = blob.indexOf(0);
  const content = blob.subarray(nullIndex + 1);

  return content;
}


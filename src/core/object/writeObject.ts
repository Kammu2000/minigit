import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { HashId } from '../../types';

export const writeObject = (object: Buffer, sha: HashId): void => {
  const objectDir = path.join(".minigit/objects", sha.slice(0, 2));
  const objectFilePath = path.join(objectDir, sha.slice(2));
 
  if(!fs.existsSync(objectDir)){
    fs.mkdirSync(objectDir, { recursive: true });
  }

  fs.writeFileSync(objectFilePath, zlib.deflateSync(object));
}

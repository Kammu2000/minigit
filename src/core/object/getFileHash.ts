import { readFileSync} from 'fs';
import { createHash } from 'crypto';
import { Buffer } from 'buffer';
import { writeObject } from './writeObject.js';
import { HashId, HashOptions } from '../../common/types.js';

export const getFileHash = (filePath: string, options?: HashOptions): HashId => {
  // step - 1: read file content 
  const content = readFileSync(filePath);

  // step - 2: make blob  
  const header = `blob ${content.length}\0`;
  const blob = Buffer.concat([Buffer.from(header), content]);
  
  // step - 3: create fileHash
  const fileSha = createHash("sha1").update(blob).digest("hex");
  
  // step - 4: store fileContent to objects if required
  if(options?.write){
    writeObject(blob, fileSha);
  }
  
  return fileSha;
}


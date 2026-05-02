import { readFileSync} from 'fs';
import { createHash } from 'crypto';
import { Buffer } from 'buffer';
import { writeObject } from './writeObject';
import { HashId, HashOptions } from '../../common/types';

export const getFileHash = (filePath: string, options: HashOptions): HashId => {
  // step - 1: read file content 
  const content = readFileSync(filePath);

  // step - 2: make fileObject  
  const header = `fileObject ${content.length}\0`;
  const fileObject = Buffer.concat([Buffer.from(header), content]);
  
  // step - 3: create fileHash
  const fileSha = createHash("sha1").update(fileObject).digest("hex");
  
  // step - 4: store fileContent to objects if required
  if(options.write){
    writeObject(fileObject, fileSha);
  }
  
  return fileSha;
}


import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { MODE_VS_TYPE } from '../../common/constants';
import { HashId } from '../../common/types';

export const lsTree = (treeHash: HashId): void => {
  const objectDir = path.join(process.cwd(), ".minigit/objects", treeHash.slice(0, 2));
  const objectFilePath = path.join(objectDir, treeHash.slice(2));

  if(!fs.existsSync(objectFilePath)){
    throw new Error("Not a valid object");
  }

  const treeBuffer = zlib.inflateSync(fs.readFileSync(objectFilePath));
  let nullIndex = treeBuffer.indexOf(0);
  const treeBody = treeBuffer.subarray(nullIndex + 1);

  let left = 0;

  while(left < treeBody.length){
      const spaceIndex = treeBody.indexOf(' ', left);
      const mode = treeBody.subarray(left, spaceIndex).toString("utf8");
      nullIndex = treeBody.indexOf(0, left);
      const name = treeBody.subarray(spaceIndex + 1, nullIndex).toString("utf8");
      const hash = treeBody.subarray(nullIndex + 1, nullIndex + 21).toString("hex");
      left = nullIndex + 21;

      console.log(`${mode} ${MODE_VS_TYPE[mode]} ${hash} ${name} \n`);
  }
}

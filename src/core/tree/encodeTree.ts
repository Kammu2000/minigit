import { TreeEntry } from "../../common/types.js";

export const encodeTreeObject = (entries: TreeEntry[]): Buffer<ArrayBuffer> => {
  const buffers: Buffer[] = [];

  for(const entry of entries){
    const header = Buffer.from(`${entry.mode} ${entry.name}\0`);
    const body = Buffer.from(entry.sha, "hex");
    buffers.push(header);
    buffers.push(body);
  }

  const treeBody = Buffer.concat(buffers);
  const treeHeader = Buffer.from(`tree ${treeBody.length}\0`); 

  return Buffer.concat([treeHeader, treeBody]);;
};


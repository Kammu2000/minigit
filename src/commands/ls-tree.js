const zlib = require("node:zlib");
const path = require("node:path"); 
const fs = require('node:fs');
const { MODE_VS_TYPE } = require("../constants.js");

module.exports = (treeHash) => {

  const objectDir = path.join(process.cwd(), ".minigit/objects", treeHash.slice(0, 2));
  const objectFilePath = path.join(objectDir, treeHash.slice(2));

  if(!fs.existsSync(objectFilePath)){
    throw new Error("Not a valid object");
  }

  const treeBuffer = zlib.inflateSync(fs.readFileSync(objectFilePath));
  let nullIndex = treeBuffer.indexOf(0);
  const treeBody = treeBuffer.slice(nullIndex + 1);

  let left = 0;

  while(left < treeBody.length){
      const spaceIndex = treeBody.indexOf(' ', left);
      const mode = treeBody.slice(left, spaceIndex).toString("utf8");
      nullIndex = treeBody.indexOf(0, left);
      const name = treeBody.slice(spaceIndex + 1, nullIndex).toString("utf8");
      const hash = treeBody.slice(nullIndex + 1, nullIndex + 21).toString("hex");
      left = nullIndex + 21;

      process.stdout.write(`${mode} ${MODE_VS_TYPE[mode]} ${hash} ${name} \n`);
  }

}

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

module.exports = (flag, hashId) => {
 if(flag !== "-p"){
    throw new Error("flag is not valid");
  } 

  const objectDir = path.join(process.cwd(), ".minigit/objects", hashId.slice(0, 2));
  const objectFilePath = path.join(objectDir, hashId.slice(2));
  const storedHashId = fs.readFileSync(objectFilePath);
  const blob = zlib.inflateSync(storedHashId);
  const nullIndex = blob.indexOf(0);
  const content = blob.slice(nullIndex + 1);

  process.stdout.write(`${content}\n`);
}


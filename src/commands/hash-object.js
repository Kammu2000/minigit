const fs = require("node:fs");
const path = require("node:path");
const { Buffer } = require("node:buffer");
const crypto = require("node:crypto");
const zlib = require('node:zlib');

module.exports = (flag, filePath) => {
  // step - 1: read file content 
  const content = fs.readFileSync(filePath);

  // step - 2: make blob  
  const header = `blob ${content.length}\0`;
  const blob = Buffer.concat([Buffer.from(header), content]);
  
  // step - 3: create hash
  const hashId = crypto.createHash("sha1").update(blob).digest("hex");
  
  if(flag === "-w"){
    const objectDir = path.join(process.cwd(), ".minigit/objects", hashId.slice(0, 2));
    const objectPath = path.join(objectDir, hashId.slice(2));

    // step - 4: create folder and store content in the folder
    if(!fs.existsSync(objectDir)){
      fs.mkdirSync(objectDir, { recursive: true });
    } 

    fs.writeFileSync(objectPath, zlib.deflateSync(blob));
  }

  process.stdout.write("hashId"); 
  return hashId;
}


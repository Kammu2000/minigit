const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require("node:zlib");
const hashObject = require('./hash-object');
const { MODE } = require("../constants.js");

function writeTree(dir = process.cwd()) {
  dir = path.resolve(dir);

  const items = fs.readdirSync(dir, { withFileTypes: true }).filter((item) => item.name !== ".minigit" && item.name !== ".git");
  items.sort((a, b) => a.name.localeCompare(b.name));
  const entries = [];

  for(const item of items){
    if(item.isFile()){
      const filePath = path.join(dir, item.name);
      const fileSha = hashObject("-w", filePath);
      entries.push({ mode: MODE.BLOB, name: item.name, sha: fileSha });
    }
    else if(item.isDirectory()){
      const dirPath = path.join(dir, item.name);
      const sha = writeTree(dirPath);
      entries.push({ mode: MODE.TREE, name: item.name, sha });
    }
  }

  const buffers = [];

  for(const entry of entries){
    const header = Buffer.from(`${entry.mode} ${entry.name}\0`);
    const body = Buffer.from(entry.sha, "hex");
    buffers.push(header);
    buffers.push(body);
  }

  const treeBody = Buffer.concat(buffers);
  const treeHeader = Buffer.from(`tree ${treeBody.length}\0`); 
  const treeObject = Buffer.concat([treeHeader, treeBody]);
  
  const treeSha = crypto.createHash("sha1").update(treeObject).digest("hex");
  const objectDir = path.join(".minigit/objects", treeSha.slice(0, 2));
  const objectFilePath = path.join(objectDir, treeSha.slice(2));
 
  if(!fs.existsSync(objectDir)){
    fs.mkdirSync(objectDir, { recursive: true });
  }

  fs.writeFileSync(objectFilePath, zlib.deflateSync(treeObject));

  process.stdout.write(`${treeSha} \n`); 
  return treeSha;
}

module.exports = writeTree;


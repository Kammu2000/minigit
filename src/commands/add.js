const fs = require("node:fs");
const { MODE } = require("../constants.js");
const hashObject = require("../commands/hash-object");
const { writeIndex, readIndex } = require("../core/index.js");

function addFile(filePath){
  if(!fs.existsSync(filePath)){
    throw new Error("Not a valid file path");
  }

  const sha = hashObject("-w", filePath);
  const index = readIndex();

  index.set(filePath, { mode: MODE.BLOB, sha });
  writeIndex(index);
  return;
}

function addFolder(folderPath){
  for (const entityName of fs.readdirSync(folderPath)) {
    const p = path.join(folderPath, entityName);
    
    if(fs.statSync(p).isDirectory()){
      addFolder(p);
    }
    else addFile(p);
  }

  return;
}

function add(paths){
  for(const entityPath of paths){
    const stats = fs.statSync(entityPath);
    const absoluteEntityPath = path.join(process.cwd(), entityPath);

    if(stats.isDirectory()){
      addFolder(absoluteEntityPath);  
    }
    else if(stats.isFile()){
      addFile(absoluteEntityPath);
    }
  } 
}

module.exports = add;

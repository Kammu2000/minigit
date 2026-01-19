const path = require("node:path");
const fs = require("node:fs");

const INDEX_FILE_PATH = path.join(process.cwd(), ".minigit/index");

function readIndex(){
  const index = new Map();

  if(!fs.existsSync(INDEX_FILE_PATH)){
    return index;
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  
  if(!content){
    return index;
  }

  const lines = content.split("\n");

  for(const line of lines){
    const [mode, filePath, sha] = line.split(" ");
    index.set(filePath, { mode, sha });
  }
    
  return index;
}

function writeIndex(index){
  const lines = [];
  const sortedPaths = Array.from(index.keys()).sort();

  for(const filePath of sortedPaths){

    const { mode, sha } = index.get(filePath);
    lines.push(`${mode} ${filePath} ${sha}`)
  }

  fs.writeFileSync(INDEX_FILE_PATH, lines.join("\n"));
  
  return;
}

module.exports = { readIndex, writeIndex };

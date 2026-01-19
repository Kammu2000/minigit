const { writeIndex, readIndex } = require("../core/index.js");

function removeFile(filePath){
  const index = readIndex();

  if(!index.has(filePath)){
    return;
  }

  index.delete(filePath);
  writeIndex(index);
  return;
}

module.exports = removeFile;

const fs = require('node:fs');
const path = require('node:path');

module.exports = () => {

  const minigit = path.join(process.cwd(), ".minigit"); 
  const objects = path.join(minigit, "objects");
  const refs = path.join(minigit, "refs");
  fs.mkdirSync(minigit, { recursive: true });
  fs.mkdirSync(objects, { recursive: true });
  fs.mkdirSync(refs, { recursive: true });
 
  fs.writeFileSync(path.join(minigit, "HEAD"), "ref: refs/heads/main\n")
  process.stdout.write("Initialized empty minigit repository in", minigit, "\n");
  return; 
}


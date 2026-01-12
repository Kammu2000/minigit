#!/usr/bin/env node

const path = require("node:path");
const [, , command, ...args] = process.argv;

if(!command){
  console.error("Error, no command specified");
  process.exit(1);
}

try {
  const commandPath = path.join(__dirname, "../src/commands/", `${command}.js`);
  const commandFn = require(commandPath);
  commandFn(...args);
} catch (error) {
   console.error(error);  
}


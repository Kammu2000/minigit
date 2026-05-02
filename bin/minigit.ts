#!/usr/bin/env node

import path from 'path';

const [, , command, ...args] = process.argv;

if(!command){
  console.error("Error, no command specified");
  process.exit(1);
}

try {
  const commandPath = path.join(__dirname, "../src/commands/", `${command}.js`);
  const commandFn = await import(commandPath);
  commandFn(...args);
} catch (error) {
   console.error(error);  
}


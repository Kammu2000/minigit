#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { parseCLI } from '../src/common/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { command, args } = parseCLI(); 

if(!command){
  console.error("Error, no command specified");
  process.exit(1);
}

try {
  const commandPath = path.join(__dirname, "../src/commands/", `${command}.js`);
  const module = await import(commandPath);
  const commandFn = module.default; 
  commandFn(args);
} catch (error: any) {
  switch(error.code){
    case "ERR_MODULE_NOT_FOUND": {
        console.log(`minigit: ${command} is not a minigit command`);
        break;
    }

    default: {
      console.log(`Unknown error occured: ${error.message}]`);
    }
  }
}


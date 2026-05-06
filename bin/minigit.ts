#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { parseCLI } from '../src/common/utils.js';
import { handleError } from '../src/common/helpers/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { command, args } = parseCLI(); 

try {
  const commandPath = path.join(__dirname, "../src/commands/", `${command}.js`);
  const module = await import(commandPath);
  const commandFn = module.default; 
  commandFn(args);
} catch (error: unknown) {
  handleError(error);
}


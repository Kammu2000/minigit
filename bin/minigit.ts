#!/usr/bin/env node

import { parseCLI } from "../src/cli/parseCLI.js";
import { getCommand } from "../src/cli/registry.js";
import { handleError } from "../src/common/helpers/errorHandler.js";

const { command, args } = parseCLI();

try {
  const commandObj = getCommand(command);
  commandObj.execute(args);
} catch (error: unknown) {
  handleError(error);
}

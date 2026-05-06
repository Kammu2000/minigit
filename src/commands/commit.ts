import { InvalidCommandError } from "../common/helpers/errors/minigit.js";
import logger from "../common/helpers/logger.js";
import { commit } from "../core/commit/commit.js";

const commitCommand = (args: string[]): void => {
  const [flag, message] = args; 

  if(!flag || flag !== "-m" || !message){
    throw new InvalidCommandError("please provide -m flag along with commit message to commit your changes");
  }

  const commitId = commit(message);
  logger.log(`Committed changes with commit Id: ${commitId}`);
  return;
}


export default commitCommand;

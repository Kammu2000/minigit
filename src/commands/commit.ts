import logger from "../common/helpers/logger.js";
import { commit } from "../core/commit/commit.js";

const commitCommand = (args: string[]): void => {
  const [flag, message] = args; 

  if(flag != "-m" || !message){
    throw new Error("Invalid command: please write a commit message!");
  }

  const commitId = commit(message);
  logger.log(`Committed changes with commit Id: ${commitId}`);
  return;
}


export default commitCommand;

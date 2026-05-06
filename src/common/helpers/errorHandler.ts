import { MinigitError } from "./errors/minigit.js";
import logger from "./logger.js";

export const handleError = (error: unknown): void => {
  if(error instanceof MinigitError) {
    logger.logError(error.message);
    return;
  }

  if(error instanceof Error){
    logger.logError(`[INTERNAL-ERROR]: ${error.message}`)
    return;
  }

  logger.logError("Unknown error occured");
}

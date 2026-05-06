import { MinigitError } from "./minigit.js";
import { ERROR_CODES } from "./types.js";

export abstract class IndexError extends MinigitError {}

export class IndexNotFoundError extends IndexError {
  code: ERROR_CODES = ERROR_CODES.INDEX_NOT_FOUND_ERROR;

  constructor(){
      super(`${ERROR_CODES.INDEX_NOT_FOUND_ERROR}: Index file is missing in .minigit directory`);
  }
}

export class IndexCorruptedError extends IndexError {
  code: ERROR_CODES = ERROR_CODES.INDEX_CORRUPTED_ERROR;

  constructor(reason: string){
    super(`${ERROR_CODES.INDEX_CORRUPTED_ERROR}: ${reason}`);
  }
}

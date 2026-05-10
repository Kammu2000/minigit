import { ERROR_CODES } from "./types.js";
import { MinigitError } from "./minigit.js";
import { HashId } from "../../types.js";
import { OBJECT_TYPE } from "../../constants.js";

export abstract class ObjectError extends MinigitError {}

export class ObjectNotFoundError extends ObjectError {
  override code: ERROR_CODES = ERROR_CODES.OBJECT_NOT_FOUND_ERROR;

  constructor(hashId: HashId, type?: OBJECT_TYPE) {
    super(
      `${ERROR_CODES.OBJECT_NOT_FOUND_ERROR}: ${type ?? ""} object with ${hashId} was not found`,
    );
  }
}

export class ObjectCorruptedError extends ObjectError {
  code: ERROR_CODES = ERROR_CODES.OBJECT_CORRUPTED_ERROR;

  constructor(hashId: HashId) {
    super(
      `${ERROR_CODES.OBJECT_CORRUPTED_ERROR}: object with ${hashId} is corrupted`,
    );
  }
}

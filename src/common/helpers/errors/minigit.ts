import { ERROR_CODES } from "./types.js";

export abstract class MinigitError extends Error {
  abstract readonly code: ERROR_CODES;
  readonly meta: Record<string, unknown> | undefined;

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.meta = meta;
    this.name = this.constructor.name;
  }
}

export class RepositoryAlreadyInitializedError extends MinigitError {
  override code: ERROR_CODES = ERROR_CODES.REPOSITORY_ALREADY_INITIALIZED_ERROR;

  constructor() {
    super(
      `${ERROR_CODES.REPOSITORY_ALREADY_INITIALIZED_ERROR}: Already a minigit repository`,
    );
  }
}

export class MinigitPathNotFoundError extends MinigitError {
  override code: ERROR_CODES = ERROR_CODES.MINIGIT_PATH_NOT_FOUND_ERROR;

  constructor(path: string) {
    super(
      `${ERROR_CODES.MINIGIT_PATH_NOT_FOUND_ERROR}: ${path} was not found in .minigit folder`,
    );
  }
}

export class InvalidCommandError extends MinigitError {
  override code: ERROR_CODES = ERROR_CODES.INVALID_COMMAND_ERROR;

  constructor(reason: string) {
    super(`${ERROR_CODES.INVALID_COMMAND_ERROR}: ${reason}`);
  }
}

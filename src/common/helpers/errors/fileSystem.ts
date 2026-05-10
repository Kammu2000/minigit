import { MinigitError } from "./minigit.js";
import { ERROR_CODES } from "./types.js";

export abstract class FileSystemError extends MinigitError {}

export class FileNotFoundError extends FileSystemError {
  override code: ERROR_CODES = ERROR_CODES.FILE_NOT_FOUND_ERROR;

  constructor(path: string) {
    super(
      `${ERROR_CODES.FILE_NOT_FOUND_ERROR}: ${path} file was not found in working directory`,
    );
  }
}

export class DirectoryNotFoundError extends FileSystemError {
  override code: ERROR_CODES = ERROR_CODES.DIRECTORY_NOT_FOUND_ERROR;

  constructor(path: string) {
    super(
      `${ERROR_CODES.FILE_NOT_FOUND_ERROR}: ${path} directory was not found in working directory`,
    );
  }
}

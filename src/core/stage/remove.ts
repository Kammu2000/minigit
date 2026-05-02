import { writeIndex, readIndex } from './index.js';

export const removeFileFromIndex = (filePath: string): void => {
  const index = readIndex();

  if(index.has(filePath)){
    index.delete(filePath);
    writeIndex(index);
  }

  return;
}


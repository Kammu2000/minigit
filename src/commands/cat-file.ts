import { HashId } from '../common/types.js';
import { getFileContent } from '../core/object/getFileContent.js';

const catFileCommand = (flag: string, hashId: HashId): void => {
  const content = getFileContent(flag, hashId);
  console.log(`${content}\n`);
}

export default catFileCommand;

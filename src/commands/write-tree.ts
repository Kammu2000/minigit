import { writeTreeFromIndex } from '../core/tree/writeTree.js';
import logger from '../common/helpers/logger.js';
import { HashId } from '../common/types.js';

const writeTreeCommand = (): HashId => {
  const treeSha = writeTreeFromIndex();
  logger.log(`${treeSha}`); 
  return treeSha;
}

export default writeTreeCommand;

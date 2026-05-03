import { writeTreeFromIndex } from '../core/tree/writeTree.js';
import { HashId } from '../common/types.js';

const writeTreeCommand = (): HashId => {
  const treeSha = writeTreeFromIndex();
  console.log(`${treeSha} \n`); 
  return treeSha;
}

export default writeTreeCommand;

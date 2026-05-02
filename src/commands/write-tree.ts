import { writeTree } from '../core/tree/writeTree.js';
import { HashId } from '../common/types.js';

const writeTreeCommand = (dir: string): HashId => {
  const treeSha = writeTree(dir);
  console.log(`${treeSha} \n`); 
  return treeSha;
}

export default writeTreeCommand;

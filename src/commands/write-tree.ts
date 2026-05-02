import { writeTree } from '../core/tree/writeTree.js';
import { HashId } from '../common/types.js';

const writeTreeCommand = (args: string[]): HashId => {
  const [dir] = args;

  if(!dir){
    throw new Error("Invalid command");
  }
  
  const treeSha = writeTree(dir);
  console.log(`${treeSha} \n`); 
  return treeSha;
}

export default writeTreeCommand;

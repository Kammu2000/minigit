import path from 'path';
import fs from 'fs';
import { init } from '../core/init.js';

const initCommand = (): void => {
  const minigit = path.join(process.cwd(), ".minigit"); 

  if(fs.existsSync(minigit)){
    console.log("Already a minigit repository");
    return;
  }

  try {
    init();
    console.log(`Initialized empty minigit repository in ${minigit}`);
  } catch (error) {
    console.log(error);  
  }
  return; 
}

export default initCommand;

import path from 'path';
import fs from 'fs';
import { init } from '../core/init.js';
import logger from '../common/helpers/logger.js';

const initCommand = (): void => {
  const minigit = path.join(process.cwd(), ".minigit"); 

  if(fs.existsSync(minigit)){
    logger.log("Already a minigit repository");
    return;
  }

  try {
    init();
    logger.log(`Initialized empty minigit repository in ${minigit}`);
  } catch (error) {
    logger.log(error);  
  }
  return; 
}

export default initCommand;

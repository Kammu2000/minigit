import { init } from '../core/init.js';

const initCommand = (): void => {
  const minigit = init();
  console.log(`Initialized empty minigit repository in ${minigit}`);
  return; 
}

export default initCommand;

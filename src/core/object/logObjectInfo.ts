import { readObject } from './readObject.js';
import logger from '../../common/helpers/logger.js';
import { decodeTreeObject } from '../tree/decodeTree.js';
import { HashId } from '../../common/types.js';

export const logObjectInfo = (flag: string, hashId: HashId): void => {
  const { type, body } = readObject(hashId);

  if(flag === "-t"){
    logger.log(type);
    return;
  }

  if(flag === "-p"){
    switch (type) {
      case "blob": {
        const content = body.toString("utf8");
        logger.logFile(content);
        return;
      }
        
      case "tree": {
        const entries = decodeTreeObject(body);
        logger.logTree(entries);
        return;
      }

      case "commit": {
        const content = body.toString("utf8");
        logger.log(content);
        return;
      }

      default: {
        throw new Error(`Unknown object type: ${type}`);
      }
    }
  }

  throw new Error(`${flag} is not a valid flag`);
}


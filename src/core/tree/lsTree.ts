import { readObject } from '../object/readObject.js';
import { decodeTreeObject } from './decodeTree.js';
import logger from '../../common/helpers/logger.js';
import { HashId } from '../../common/types.js';

export const lsTree = (treeHash: HashId): void => {
  const { body: treeBody } = readObject(treeHash);
  const entries = decodeTreeObject(treeBody);
  logger.logTree(entries);
  return;
}

import path from 'path';
import { readdirSync, Dirent } from 'fs';
import crypto from 'crypto';
import { buildTreeEntries } from "./buildTree";
import { encodeTreeObject } from "./encodeTree";
import { writeObject } from '../object/writeObject';
import { HashId } from '../../types';

const getDirectoryItems = (dir: string): Dirent<string>[] => {
  const items = readdirSync(dir, { withFileTypes: true }).filter((item: Dirent<string>): boolean => item.name !== ".minigit" && item.name !== ".git");
  items.sort((a: Dirent<string>, b: Dirent<string>): number => a.name.localeCompare(b.name));
  return items;
};

export const writeTree = (dir: string = process.cwd()): HashId => {
  dir = path.resolve(dir);

  const items = getDirectoryItems(dir);
  const entries = buildTreeEntries(items, dir);
  const treeObject = encodeTreeObject(entries);

  const treeSha = crypto.createHash("sha1").update(treeObject).digest("hex");
  writeObject(treeObject, treeSha);

  return treeSha;
}

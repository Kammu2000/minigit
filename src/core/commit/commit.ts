import { createHash } from 'crypto';
import { getHeadCommit, updateHead } from "./utils.js";
import { writeObject } from '../object/writeObject.js';
import { writeTreeFromIndex } from '../tree/writeTree.js';
import { HashId } from "../../common/types.js";

export const commit = (message: string): HashId => {
  const treeSha = writeTreeFromIndex();
  const parentCommitId = getHeadCommit();

  const lines = [`tree ${treeSha}`, `parent ${parentCommitId}`, `author Deepanshu Upadhyay`, `Date ${new Date().toString()}`, "", message]
  const commitBody = lines.join("\n");

  const commitObject = Buffer.from(`commit ${commitBody.length}\0${commitBody}`);
  const commitSha = createHash("sha1").update(commitObject).digest("hex"); 

  writeObject(commitObject, commitSha);
  updateHead(commitSha);
  return commitSha;
};

import logger from "../common/helpers/logger.js";
import { getBranchList } from "../core/commit/getBranchList.js";
import { getHeadContent } from "../core/commit/utils.js";

const branchCommand = (): void => {
  const root = process.cwd();
  const branches = getBranchList(); 
  const headContent = getHeadContent(root); 
  let currentBranch = undefined;

  if(headContent?.startsWith("ref:")){
    const refsPath = headContent.split(" ")[1];
    currentBranch = refsPath?.split('/')[2];
  }
  
  logger.logBranchList(branches, currentBranch);
};

export default branchCommand;

import { getHeadContent } from "../../common/utils/headUtils.js";

export const getCurrentBranch = (): string | undefined => {
  const root = process.cwd();
  const headContent = getHeadContent(root);
  let currentBranch = undefined;

  if (headContent?.startsWith("ref:")) {
    const refsPath = headContent.split(" ")[1];
    currentBranch = refsPath?.split("/")[2];
  }

  return currentBranch;
};

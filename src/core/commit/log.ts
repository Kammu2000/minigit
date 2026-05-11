import { readObject } from "../object/readObject.js";
import { getHeadCommit } from "../../common/utils/headUtils.js";

const getCommitLog = (lines: string[], hashId: string): string => {
  const commitHeader = `commit ${hashId}`;
  const commitBody = lines
    .map((line: string) => {
      if (line.startsWith("parent") || line.startsWith("tree"))
        return "invalid";

      if (line.startsWith("author")) {
        const authorName = line.slice(line.indexOf(" ") + 1);
        return `Author: ${authorName}`;
      }

      if (line.startsWith("Date")) {
        const date = line.slice(line.indexOf(" ") + 1);
        return `Date:   ${date}`;
      }

      if (line === "") return line;

      return `    ${line}`;
    })
    .filter((line: string): boolean => line !== "invalid")
    .join("\n");

  return `${commitHeader}\n${commitBody}`;
};

export const getCommitsLog = (): string => {
  const headCommitId = getHeadCommit();

  if (!headCommitId) return "";

  let currentId = headCommitId;
  const commitsLog: string[] = [];

  while (currentId) {
    const { body } = readObject(currentId);
    const lines = body
      .toString("utf8")
      .split("\n")
      .map((line: string): string => line.trim());
    const commitLog = getCommitLog(lines, currentId);
    commitsLog.push(commitLog);

    const parentLine = lines.find((line: string): boolean =>
      line.startsWith("parent"),
    );

    if (!parentLine) break;

    const parentCommitId = parentLine.split(" ")[1];

    if (!parentCommitId || parentCommitId === "null") break;

    currentId = parentCommitId;
  }

  return commitsLog.join("\n\n");
};

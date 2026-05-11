import { Edit } from "../../common/types.js";

export const computeDiff = (oldLines: string[], newLines: string[]): Edit[] => {
  const m = oldLines.length;
  const n = newLines.length;

  const edits: Edit[] = [];
  const dp: number[][] = Array.from({ length: m + 1 }, (): number[] =>
    Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = m,
    j = n;

  while (i >= 1 && j >= 1) {
    let edit: Edit;

    if (oldLines[i - 1] === newLines[j - 1]) {
      edit = {
        type: "equal",
        content: oldLines[i - 1],
        position: { oldLine: i, newLine: j },
      };

      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      edit = {
        type: "deleted",
        content: oldLines[i - 1],
        position: { oldLine: i, newLine: null },
      };

      i--;
    } else {
      edit = {
        type: "inserted",
        content: newLines[j - 1],
        position: { oldLine: null, newLine: j },
      };

      j--;
    }

    edits.push(edit);
  }

  while (i >= 1) {
    const edit: Edit = {
      type: "deleted",
      content: oldLines[i - 1],
      position: { oldLine: i, newLine: null },
    };

    i--;
    edits.push(edit);
  }

  while (j >= 1) {
    const edit: Edit = {
      type: "inserted",
      content: newLines[j - 1],
      position: { oldLine: null, newLine: j },
    };

    j--;
    edits.push(edit);
  }

  edits.reverse();
  return edits;
};

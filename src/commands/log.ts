import { spawn } from "child_process";
import { getCommitsLog } from "../core/commit/log.js";

const logCommand = () => {
  const commitsLog = getCommitsLog();

  const less = spawn("less", ["-R"], {
    stdio: ["pipe", "inherit", "inherit"],
  });

  less.stdin.write(commitsLog);
  less.stdin.end();
};

export default logCommand;

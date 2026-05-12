import { spawn } from "child_process";
import { getCommitsLog } from "../core/commit/log.js";
import { Command } from "./types.js";

export class LogCommand implements Command {
  execute(_args: string[]): void {
    const commitsLog = getCommitsLog();

    const less = spawn("less", ["-R"], {
      stdio: ["pipe", "inherit", "inherit"],
    });

    less.stdin.write(commitsLog);
    less.stdin.end();
  }
}

import { MODE_VS_TYPE } from "../constants.js";
import { TreeEntry } from "../types.js";

class Logger {
  log(value: any): void {
    console.log(value);
  }

  logFile(content: string): void {
    this.log(content);
  }

  logTree(entries: TreeEntry[]): void {
    for(const { mode, name, sha } of entries){
      this.log(`${mode} ${MODE_VS_TYPE[mode]} ${sha} ${name}`);
    }
  }

  logCommit(lines: string[]): void {
    for(const line of lines){
      this.log(line);
    }
  }
}

export default new Logger();

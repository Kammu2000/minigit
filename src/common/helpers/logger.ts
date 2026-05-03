import { MODE_VS_TYPE } from "../constants.js";
import { TreeEntry } from "../types.js";

class Logger {
  constructor() {
   
  }

  log(value: any): void {
    console.log(value);
  }

  logFile(content: string): void {
    this.log(content);
  }

  logTree(entries: TreeEntry[]): void {
    for(const { mode, name, sha } of entries){
      this.log(`${mode} ${MODE_VS_TYPE[mode]} ${sha} ${name} \n`);
    }
  }

  logCommit(): void {
  }
}

export default new Logger();

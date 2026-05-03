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

  logBranchList(branches: string[], currentBranch: string | undefined): void {
    for (const branch of branches) {
        if(branch === currentBranch){
        this.log(`* ${branch}`);
      } 
      else this.log(branch);
     } 
  }
}

export default new Logger();

import { add } from "../core/index/add.js";
import { Command } from "./types.js";

export class AddCommand implements Command {
  execute(args: string[]): void {
    add(args);
  }
}

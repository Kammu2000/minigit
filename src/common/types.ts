import { MODE } from "./constants";

export type HashId = string;

export type HashOptions = {
  write?: boolean;
}

export type TreeEntry = {
  mode: typeof MODE[keyof typeof MODE];
  name: string;
  sha: HashId;
}

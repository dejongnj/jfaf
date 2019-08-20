import * as fs from "fs";
import * as util from "util";

const versionMatch = process.version.match(/\d\d?/);
const version = (versionMatch && +versionMatch[0]) || 0;
if (version < 8) {
  throw new Error("Need node 8 or above to use this library.");
}

export const readFile = util.promisify(fs.readFile);
export const readdir = util.promisify(fs.readdir);
export const stat = util.promisify(fs.stat);

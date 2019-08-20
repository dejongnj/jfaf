import * as fs from "fs";
import * as path from "path";
import { readFile } from "./promisifiedNode";
import { IAnyObject, IBuildOptions, ISortedFolderContentList, IStatTransform } from "./types";

// basic default options
export const defaultShouldIncludeFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => true;
export const defaultIsMetaFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => {
  const {
    metaFileNames = ["meta.json"],
  } = options;
  return metaFileNames.some((filename) => dirent.name === filename);
};

// internal utility methods
export const isJsonFile = (dirent: fs.Dirent) => dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/);
export const readFileContents = (absolutePath: string) => {
  try {
    return readFile(absolutePath);
  } catch (e) {
    console.log(`Error tyring to read ${absolutePath}`);
    return Promise.resolve(Buffer.from(JSON.stringify({})));
  }
};
export const getJson = (content: Buffer) => JSON.parse(content.toString());
export const getJsonPromise = (contentPromise: Promise<Buffer>): Promise<IAnyObject> => contentPromise.then(getJson);
export const pureAssign = (...args: any) => Object.assign({}, ...args);
export const linkAdder = (relativeFolderPath: string, options: IBuildOptions = {}) => {
  const { filenameKey = "name" } = options;
  return (fileData: any) => pureAssign(fileData, { link: `${relativeFolderPath}/${fileData[filenameKey]}`});
};
export const getStatData = (stat: fs.Stats, statTransform: IStatTransform) => statTransform(stat);

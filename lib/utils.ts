import * as fs from "fs";
import * as path from "path";
import { IAnyObject, IBuildOptions, ISortedFolderContentList, IStatTransform } from "./types";

// basic default options
export const defaultShouldIncludeFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => true;
export const defaultIsMetaFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) =>
  ["meta.json"].some((filename) => dirent.name = filename);

// internal utility methods
export const isJsonFile = (dirent: fs.Dirent) => dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/);
export const readFileContents = (absolutePath: string) => fs.promises.readFile(absolutePath);
export const getJson = (content: Buffer) => JSON.parse(content.toString());
export const getJsonPromise = (contentPromise: Promise<Buffer>): Promise<IAnyObject> => contentPromise.then(getJson);
export const pureAssign = (...args: any) => Object.assign({}, ...args);
export const linkAdder = (relativeFolderPath: string) =>
  (fileData: any) => pureAssign(fileData, { link: `${relativeFolderPath}/${fileData.filename}`});
export const getStatData = (stat: fs.Stats, statTransform: IStatTransform) => statTransform(stat);



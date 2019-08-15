import * as fs from "fs";
import * as path from "path";
import { IAnyObject, IBuildOptions, IStatKeys } from "./types";

export const shouldIncludeFile = (dirent: fs.Dirent, prohibitedList: Array<string|RegExp> = []) => 
  dirent.isFile() && !prohibitedList.includes(dirent.name);
export const isMetaFile = (dirent: fs.Dirent, metaFiles: string[] = []) =>
  dirent.isFile() && metaFiles.some((filename) => dirent.name = filename);
export const isJsonFile = (dirent: fs.Dirent) => dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/);
// // const getJsonFileName = dnoirent => `${dirent.name}.json`
export const readFileContents = (absolutePath: string) => fs.promises.readFile(absolutePath);
export const getJson = (content: Buffer) => JSON.parse(content.toString());
export const getJsonPromise = (contentPromise: Promise<Buffer>) => contentPromise.then(getJson);
export const pureAssign = (...args: any) => Object.assign({}, ...args);
// // const removeExtraForwardSlashes = string => string
// export const formPath = basePath => (...pathSegments) =>
// paths.reduce((pathString, pathSegment) => `${pathString}/${pathSegment}`, basePath).replace(/\/\//g, '/')
// // const fileDirentToPath = relativePath => dirent => `${relativePath}/${dirent.name}`.replace(/\/\//g, '/')
export const linkAdder = (relativeFolderPath: string) =>
  (fileData: any) => pureAssign(fileData, { link: `${relativeFolderPath}/${fileData.filename}`});

interface ISortFolder {
  metaFileNames?: string[];
}
export const getStatData = (stat: fs.Stats, options: IStatKeys = {}) => {
  const availableStatKeys = [
    "dev", "mode", "nlink", "uid", "gid", "rdev", "blksize", "ino", "size", "blocks",
    "atimeMs", "mtimeMs", "ctimeMs", "birthtimeMs", "atime", "mtime", "ctime", "birthtime"
  ];

  const stringKeyStat = pureAssign(stat);

  const {
    allowedKeys = [new RegExp(/.*/)], disallowedKeys = [],
    devKey = "dev", modeKey = "mode", nlinkKey = "nlink", uidKey = "uid", gidKey = "gid",
    rdevKey = "rdev", blksizeKey = "blksize", inoKey = "ino", sizeKey = "size", blocksKey = "blocks",
    atimeMsKey = "atimeMs", mtimeMsKey = "mtimeMs", ctimeMsKey = "ctimeMs", birthtimeMsKey = "birthtimeMs",
    atimeKey = "atime", mtimeKey = "mtime", ctimeKey = "ctime", birthtimeKey = "birthtime",
  } = options;
  const keyNames: IAnyObject = {
    // tslint:disable-next-line: object-literal-sort-keys
    devKey, modeKey, nlinkKey, uidKey, gidKey, rdevKey, blksizeKey, inoKey, sizeKey, blocksKey,
    atimeMsKey, mtimeMsKey, ctimeMsKey, birthtimeMsKey, atimeKey, mtimeKey, ctimeKey, birthtimeKey,
  };

  return availableStatKeys
    .filter((key: string) => allowedKeys.some((regex: RegExp | string) => key.match(regex)))
    .filter((key: string) => !disallowedKeys.some((regex: RegExp | string) => key.match(regex)))
    .reduce((statObj: IAnyObject, key: string) => {
      statObj[keyNames[`${key}Key`]] = stringKeyStat[key];
      return statObj;
    }, {});
};

export const sortFolderContentList = (absolutePath: string, options: IBuildOptions = {}) =>
  (folderContentsList: any[]) => {
  const { metaFileNames = ["meta.json"] } = options;
  return folderContentsList
    .reduce((sortedObj, dirent) => {
      if (dirent.isDirectory()) { // folders
        sortedObj.folders.push(dirent);
      } else if (shouldIncludeFile(dirent)) { // files
        if (isJsonFile(dirent)) { sortedObj.jsonFiles[dirent.name] = true; }
        sortedObj.fileNames.push(dirent.name);
        if (isMetaFile(dirent, metaFileNames)) { // meta files
          sortedObj.metaFiles.push({
            contentPromise: getJsonPromise(readFileContents(path.resolve(absolutePath, dirent.name))),
            filename: dirent.name,
          });
        }
      }
      return sortedObj;
    }, {
      fileNames: [],
      folders: [],
      jsonFiles: {},
      metaFiles: [],
    });
  };

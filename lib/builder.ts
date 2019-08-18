import * as fs from "fs";
import * as path from "path";
import { IAnyObject, IBuildOptions, IGetFolderContentResponse, IJsonResponse, ISortedFolderContentList } from "./types";
import { defaultIsMetaFile, defaultShouldIncludeFile, getJsonPromise, getStatData,
  isJsonFile, linkAdder, pureAssign, readFileContents } from "./utils";

export const sortFolderContentList = (absolutePath: string, options: IBuildOptions = {})  =>
  (folderContentsList: any[]): ISortedFolderContentList => {
  const {
    isMetaFile = defaultIsMetaFile,
    shouldIncludeFile = defaultShouldIncludeFile,
  } = options;
  return folderContentsList
    .reduce((sortedObj, dirent) => {
      if (dirent.isDirectory()) { // folders
        sortedObj.folders.push(dirent);
        return sortedObj;
      }
      if (dirent.isFile() && shouldIncludeFile(dirent, absolutePath, options)) { // files
        if (isJsonFile(dirent)) { sortedObj.jsonFiles[dirent.name] = true; }
        sortedObj.filenames.push(dirent.name);
        if (isMetaFile(dirent, absolutePath, options)) { // meta files
          sortedObj.metaFiles.push({
            contentPromise: getJsonPromise(readFileContents(path.resolve(absolutePath, dirent.name))),
            filename: dirent.name,
          });
        }
      }
      return sortedObj;
    }, {
      filenames: [],
      folders: [],
      jsonFiles: {},
      metaFiles: [],
    });
  };

const getFolderContents = (
  rootPath: string,
  folderPath: string,
  options: IBuildOptions = {},
): Promise<IGetFolderContentResponse> => {
    const {
      filenameKey = "name",
      folderNameKey = "name",
      folderPathKey = "path",
      statTransform = (val: fs.Stats): IAnyObject => val,
    } = options;

    const absolutePath = path.resolve(rootPath, folderPath);

    return Promise.all([
      fs.promises.readdir(absolutePath, { withFileTypes: true }),
      fs.promises.stat(absolutePath),
    ])
      .then(([folderContentsList, folderStat]) => {
        // sort folder contents into files folders and meta files
        const {
          filenames,
          folders,
          jsonFiles,
          metaFiles,
        } = sortFolderContentList(absolutePath, options)(folderContentsList);
        metaFiles.push({
          contentPromise: Promise.resolve(getStatData(folderStat, statTransform)),
          filename: `${rootPath}/${folderPath}`,
        });

        const filePromises = filenames.map((filename: string) => {
          const jsonFileName = `${filename}.json`;
          return Promise.all([new Promise((resolve, reject) => {
            if (!jsonFiles[jsonFileName]) {
              resolve({});
            } else {
              resolve(getJsonPromise(readFileContents(path.resolve(absolutePath, jsonFileName))));
            }
          }), fs.promises.stat(path.resolve(absolutePath, filename))])
          .then(([metaData = {}, fstatData]) => {
            const statData = getStatData(fstatData, statTransform);
            return pureAssign(metaData, statData, { [filenameKey]: filename });
          })
          .then(linkAdder(folderPath));
        });

        const folderPromises = folders.map((dirent: fs.Dirent) => {
          const thisFolderPath = `${folderPath}/${dirent.name}`;
          const folderData = {
            [folderNameKey]: dirent.name,
            [folderPathKey]: thisFolderPath,
          };
          return builder(thisFolderPath, options).then((folderJson) => pureAssign(folderData, folderJson));
        });

        return { filePromises, folderPromises, jsonFiles, metaFiles };
      });
};

const builder = async (folderPath: string, options: IBuildOptions = {}): Promise<IJsonResponse> => {
  const { rootPath = process.cwd() } = options;
  const folderContent = await getFolderContents(rootPath, folderPath, options);
  const metaDataPromises = Promise.all(folderContent.metaFiles.map((file: any) => file.contentPromise));
  const filesPromise = Promise.all(folderContent.filePromises);
  const foldersPromise = Promise.all(folderContent.folderPromises);
  const [metaData, files, folders] = await Promise.all([ metaDataPromises, filesPromise, foldersPromise ]);
  return pureAssign(...metaData, { files, folders });
};

export default builder;

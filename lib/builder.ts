import * as fs from "fs";
import * as path from "path";
import { IBuildOptions } from "./types";
import { getJsonPromise, getStatData, linkAdder, pureAssign, readFileContents, sortFolderContentList } from "./utils";

interface IGetFolderContentResponse {
  filePromises: Array<Promise<any>>;
  folderPromises: Array<Promise<any>>;
  jsonFiles: object;
  metaFiles: object[];
}

const getFolderContents = (rootPath: string, folderPath: string, options: IBuildOptions = {}): any => {
  const {
    filenameKey = "filename",
    folderNameKey = "folderName",
    folderPathKey = "folderPath",
    statKeys = {},
   } = options;

  const absolutePath = path.resolve(rootPath, folderPath);

  return Promise.all([
    fs.promises.readdir(absolutePath, { withFileTypes: true }),
    fs.promises.stat(absolutePath),
  ])
    .then(([folderContentsList, folderStat]) => {
      // sort folder contents into files folders and meta files
      console.log(Object.assign(folderStat));
      const {
        fileNames,
        folders,
        jsonFiles,
        metaFiles,
      } = sortFolderContentList(absolutePath, options)(folderContentsList);
      metaFiles.push({ contentPromise: Promise.resolve(getStatData(folderStat, statKeys)) });

      const filePromises = fileNames.map((filename: string) => {
        const jsonFileName = `${filename}.json`;
        return Promise.all([new Promise((resolve, reject) => {
          if (!jsonFiles[jsonFileName]) {
            resolve({});
          } else {
            resolve(getJsonPromise(readFileContents(path.resolve(absolutePath, jsonFileName))));
          }
        }), fs.promises.stat(path.resolve(absolutePath, filename))])
        .then(([metaData = {}, fstatData]) => {
          const statData = getStatData(fstatData);
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
    })
    .catch((err) => console.log(err));
};

interface IBuilderResponse { // Promise for JSON Object
  [key: string]: any;
}
const builder = async (folderPath: string, options: IBuildOptions = {}): Promise<IBuilderResponse> => {
  const { rootPath = process.cwd() } = options;
  const folderContent = await getFolderContents(rootPath, folderPath, options);
  const metaDataPromises = Promise.all(folderContent.metaFiles.map((file: any) => file.contentPromise));
  const filesPromise = Promise.all(folderContent.filePromises);
  const foldersPromise = Promise.all(folderContent.folderPromises);
  const [metaData, files, folders] = await Promise.all([ metaDataPromises, filesPromise, foldersPromise ]);
  return pureAssign(...metaData, { files, folders });
};

export default builder;

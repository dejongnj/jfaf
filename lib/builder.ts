import * as fs from "fs";
import * as path from "path";
import { getJsonPromise, linkAdder, pureAssign, readFileContents, sortFolderContentList } from "./utils";

interface IGetFolderContentResponse {
  filePromises: Array<Promise<any>>;
  folderPromises: Array<Promise<any>>;
  jsonFiles: object;
  metaFiles: object[];
}

interface IBuildOptions {
  rootPath?: string;
  filenameKey?: string;
  metaFileNames?: string[];
}

const getFolderContents = (rootPath: string, folderPath: string, options: IBuildOptions = {}): any => {
  const { filenameKey = "filename" } = options;
  const absolutePath = path.resolve(rootPath, folderPath);
  return fs.promises.readdir(absolutePath, { withFileTypes: true })
    .then((folderContentsList) => {
      // sort folder contents into files folders and meta files
      const {
        fileNames,
        folders,
        jsonFiles,
        metaFiles,
      } = sortFolderContentList(absolutePath, options)(folderContentsList);

      const filePromises = fileNames.map((filename: string) => {
        const jsonFileName = `${filename}.json`;
        return new Promise((resolve, reject) => {
          if (!jsonFiles[jsonFileName]) {
            resolve({});
          } else {
            resolve(getJsonPromise(readFileContents(path.resolve(absolutePath, jsonFileName))));
          }
        })
        .then((metaData = {}) => pureAssign(metaData, { [filenameKey]: filename }))
        .then(linkAdder(folderPath));
      });

      const folderPromises = folders.map((dirent: fs.Dirent) => {
        const folderName1 = dirent.name;
        const folderPath2 = `${folderPath}/${dirent.name}`;
        return builder(folderPath2).then((folderJson) => pureAssign({ folderName1, folderPath2 }, folderJson));
      });

      return { filePromises, folderPromises, jsonFiles, metaFiles };
    })
    .catch((err) => console.log(err));
};



const builder = async (folderPath: string, options: IBuildOptions = {}) => {
  const { rootPath = process.cwd() } = options;
  const folderContent = await getFolderContents(rootPath, folderPath, options);
  const metaDataPromises = Promise.all(folderContent.metaFiles.map((file: any) => file.contentPromise));
  const filesPromise = Promise.all(folderContent.filePromises);
  const foldersPromise = Promise.all(folderContent.folderPromises);
  const [metaData, files, folders] = await Promise.all([ metaDataPromises, filesPromise, foldersPromise ]);
  return pureAssign(...metaData, { files, folders });
};

export default builder;

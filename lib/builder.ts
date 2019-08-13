import * as fs from 'fs'
import * as path from 'path'
import { sortFolderContentList, getJsonPromise, readFileContents, pureAssign, linkAdder } from './utils'
interface buildOptions {
  rootPath?:string;

}
let count = 1
interface GetFolderContentResponse {
  filePromises:Array<Promise<any>>;
  folderPromises:Array<Promise<any>>;
  jsonFiles:Object;
  metaFiles:Array<Object>;
}
const getFolderContents = (rootPath:string, folderPath:string, options = {}):any => {
  const absolutePath = path.resolve(rootPath, folderPath)
  return fs.promises.readdir(absolutePath, { withFileTypes: true })
    .then((folderContentsList) => {
      // sort folder contents into files folders and meta files
      console.log(sortFolderContentList)
      const { fileNames, folders, jsonFiles, metaFiles } = sortFolderContentList(absolutePath)(folderContentsList)

      const filePromises = fileNames.map((filename:string) => {
        const jsonFileName = `${filename}.json`
        return new Promise((resolve, reject) => {
          if (!jsonFiles[jsonFileName]) resolve({})
          else resolve(getJsonPromise(readFileContents(path.resolve(absolutePath, jsonFileName))))
        })
        .then((metaData = {}) => pureAssign(metaData, { filename }))
        .then(linkAdder(folderPath))
      })

      const folderPromises = folders.map((dirent:fs.Dirent) => {
        const _folderName = dirent.name
        const _folderPath = `${folderPath}/${dirent.name}`
        return builder(_folderPath).then(folderJson => pureAssign({ _folderName, _folderPath }, folderJson))
      })

      return { filePromises, folderPromises, jsonFiles, metaFiles }
    })
    .catch(err => console.log(err))
}

const builder = async (folderPath:string, options:buildOptions = {}) => {
  const { rootPath = process.cwd() } = options
  const folderContent = await getFolderContents(rootPath, folderPath)
  const metaDataPromises = Promise.all(folderContent.metaFiles.map((file:any) => file.contentPromise))
  const filesPromise = Promise.all(folderContent.filePromises)
  const foldersPromise = Promise.all(folderContent.folderPromises)
  const [metaData, files, folders] = await Promise.all([ metaDataPromises, filesPromise, foldersPromise ])
  return pureAssign(...metaData, { files, folders })
}

export default builder
import * as fs from 'fs'
import * as path from 'path'
const defaultFileDescription = {
  id: null,
  title: null,
  description: null
}
export const shouldIncludeFile = (dirent:fs.Dirent, prohibitedList:Array<string|RegExp> = []) => dirent.isFile() && !prohibitedList.includes(dirent.name)
export const isMetaFile = (dirent:fs.Dirent, metaFiles:Array<string> = []) => dirent.isFile() && metaFiles.some(filename => dirent.name = filename)
export const isJsonFile = (dirent:fs.Dirent) => dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/)
// // const getJsonFileName = dnoirent => `${dirent.name}.json`
export const readFileContents = (absolutePath:string) => fs.promises.readFile(absolutePath)
export const getJson = (content:Buffer) => JSON.parse(content.toString())
export const getJsonPromise = (contentPromise:Promise<Buffer>) => contentPromise.then(getJson)
export const pureAssign = (...args:any) => Object.assign({}, ...args)
// // const removeExtraForwardSlashes = string => string
// export const formPath = basePath => (...pathSegments) => paths.reduce((pathString, pathSegment) => `${pathString}/${pathSegment}`, basePath).replace(/\/\//g, '/')
// // const fileDirentToPath = relativePath => dirent => `${relativePath}/${dirent.name}`.replace(/\/\//g, '/')
export const linkAdder = (relativeFolderPath:string) => (fileData:any) => pureAssign(fileData, { link: `${relativeFolderPath}/${fileData.filename}`})

export const sortFolderContentList = (absolutePath:string) => (folderContentsList:Array<any>) => folderContentsList
.reduce((sortedObj, dirent) => {
  if (dirent.isDirectory()) { // folders
    sortedObj.folders.push(dirent);
  } else if (shouldIncludeFile(dirent)) { // files
    if (isJsonFile(dirent)) sortedObj.jsonFiles[dirent.name] = true;
    sortedObj.fileNames.push(dirent.name)
    if (isMetaFile(dirent, ['meta.json'])) { // meta files
      sortedObj.metaFiles.push({
        filename: dirent.name,
        contentPromise: getJsonPromise(readFileContents(path.resolve(absolutePath, dirent.name)))
      })
    }
  };
  return sortedObj
}, {
  fileNames: [],
  folders: [],
  jsonFiles: {},
  metaFiles: []
})
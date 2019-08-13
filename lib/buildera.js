const fs = require('fs')
const path = require('path')

/**
 * 
 * @param {string} folderPath the relative to root (by default) folder path
 * @param {*} options object of options
 */
const defaultFileDescription = {
  id: null,
  title: null,
  description: null
}
const shouldIncludeFile = (dirent, prohibitedList = []) => dirent.isFile() && !prohibitedList.includes(dirent.name)
const isMetaFile = (dirent, metaFiles = []) => dirent.isFile() && metaFiles.some(filename => dirent.name = filename)
const isJsonFile = dirent => dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/)
// const getJsonFileName = dnoirent => `${dirent.name}.json`
const readFileContents = (absolutePath) => fs.promises.readFile(absolutePath)
const getJson = content => JSON.parse(content)
const getJsonPromise = contentPromise => contentPromise.then(getJson)
const pureAssign = (...args) => Object.assign({}, ...args)
// const removeExtraForwardSlashes = string => string
const formPath = basePath => (...pathSegments) => paths.reduce((pathString, pathSegment) => `${pathString}/${pathSegment}`, basePath).replace(/\/\//g, '/')
// const fileDirentToPath = relativePath => dirent => `${relativePath}/${dirent.name}`.replace(/\/\//g, '/')
const linkAdder = relativeFolderPath => fileData => pureAssign(fileData, { link: `${relativeFolderPath}/${fileData.filename}`})

const sortFolderContentList = absolutePath => folderContentsList => folderContentsList
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

// const getFolderContents = (rootPath, folderPath, options = {}) => {
//   const absolutePath = path.resolve(rootPath, folderPath)
//   return fs.promises.readdir(absolutePath, { withFileTypes: true })
//     .then((folderContentsList) => {
//       // sort folder contents into files folders and meta files
//       const { fileNames, folders, jsonFiles, metaFiles } = sortFolderContentList(absolutePath)(folderContentsList)

//       const filePromises = fileNames.map(filename => {
//         const jsonFileName = `${filename}.json`
//         return new Promise((resolve, reject) => {
//           if (!jsonFiles[jsonFileName]) resolve({})
//           else resolve(getJsonPromise(readFileContents(path.resolve(absolutePath, jsonFileName))))
//         })
//         .then((metaData = {}) => pureAssign(metaData, { filename }))
//         .then(linkAdder(folderPath))
//       })

//       const folderPromises = folders.map(dirent => {
//         const _folderName = dirent.name
//         const _folderPath = `${folderPath}/${dirent.name}`
//         return folderJsonBuilder(_folderPath).then(folderJson => pureAssign({ _folderName, _folderPath }, folderJson))
//       })

//       return { filePromises, folderPromises, jsonFiles, metaFiles }
//     })
// }

// const folderJsonBuilder = async (folderPath, options = {}) => {
//   const { rootPath = process.cwd() } = options
//   const folderContent = await getFolderContents(rootPath, folderPath)
//   const metaDataPromises = Promise.all(folderContent.metaFiles.map(file => file.contentPromise))
//   const filesPromise = Promise.all(folderContent.filePromises)
//   const foldersPromise = Promise.all(folderContent.folderPromises)
//   const [metaData, files, folders] = await Promise.all([ metaDataPromises, filesPromise, foldersPromise ])
//   return pureAssign(...metaData, { files, folders })
// }

// const run = async () => {
//   const json = await folderJsonBuilder('public/content/courses/test-course')
//   // setTimeout(() => fs.writeFileSync('jsonData.json', JSON.stringify(json)), 5000)
//   console.log(json)
// }

// run()
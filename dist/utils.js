"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var defaultFileDescription = {
    id: null,
    title: null,
    description: null
};
exports.shouldIncludeFile = function (dirent, prohibitedList) {
    if (prohibitedList === void 0) { prohibitedList = []; }
    return dirent.isFile() && !prohibitedList.includes(dirent.name);
};
exports.isMetaFile = function (dirent, metaFiles) {
    if (metaFiles === void 0) { metaFiles = []; }
    return dirent.isFile() && metaFiles.some(function (filename) { return dirent.name = filename; });
};
exports.isJsonFile = function (dirent) { return dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/); };
// // const getJsonFileName = dnoirent => `${dirent.name}.json`
exports.readFileContents = function (absolutePath) { return fs.promises.readFile(absolutePath); };
exports.getJson = function (content) { return JSON.parse(content.toString()); };
exports.getJsonPromise = function (contentPromise) { return contentPromise.then(exports.getJson); };
exports.pureAssign = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, [{}].concat(args));
};
// // const removeExtraForwardSlashes = string => string
// export const formPath = basePath => (...pathSegments) => paths.reduce((pathString, pathSegment) => `${pathString}/${pathSegment}`, basePath).replace(/\/\//g, '/')
// // const fileDirentToPath = relativePath => dirent => `${relativePath}/${dirent.name}`.replace(/\/\//g, '/')
exports.linkAdder = function (relativeFolderPath) { return function (fileData) { return exports.pureAssign(fileData, { link: relativeFolderPath + "/" + fileData.filename }); }; };
exports.sortFolderContentList = function (absolutePath) { return function (folderContentsList) { return folderContentsList
    .reduce(function (sortedObj, dirent) {
    if (dirent.isDirectory()) { // folders
        sortedObj.folders.push(dirent);
    }
    else if (exports.shouldIncludeFile(dirent)) { // files
        if (exports.isJsonFile(dirent))
            sortedObj.jsonFiles[dirent.name] = true;
        sortedObj.fileNames.push(dirent.name);
        if (exports.isMetaFile(dirent, ['meta.json'])) { // meta files
            sortedObj.metaFiles.push({
                filename: dirent.name,
                contentPromise: exports.getJsonPromise(exports.readFileContents(path.resolve(absolutePath, dirent.name)))
            });
        }
    }
    ;
    return sortedObj;
}, {
    fileNames: [],
    folders: [],
    jsonFiles: {},
    metaFiles: []
}); }; };

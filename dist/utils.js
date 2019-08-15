"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
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
// export const formPath = basePath => (...pathSegments) =>
// paths.reduce((pathString, pathSegment) => `${pathString}/${pathSegment}`, basePath).replace(/\/\//g, '/')
// // const fileDirentToPath = relativePath => dirent => `${relativePath}/${dirent.name}`.replace(/\/\//g, '/')
exports.linkAdder = function (relativeFolderPath) {
    return function (fileData) { return exports.pureAssign(fileData, { link: relativeFolderPath + "/" + fileData.filename }); };
};
exports.getStatData = function (stat, options) {
    if (options === void 0) { options = {}; }
    var availableStatKeys = [
        "dev", "mode", "nlink", "uid", "gid", "rdev", "blksize", "ino", "size", "blocks",
        "atimeMs", "mtimeMs", "ctimeMs", "birthtimeMs", "atime", "mtime", "ctime", "birthtime"
    ];
    var stringKeyStat = exports.pureAssign(stat);
    var _a = options.allowedKeys, allowedKeys = _a === void 0 ? [new RegExp(/.*/)] : _a, _b = options.disallowedKeys, disallowedKeys = _b === void 0 ? [] : _b, _c = options.devKey, devKey = _c === void 0 ? "dev" : _c, _d = options.modeKey, modeKey = _d === void 0 ? "mode" : _d, _e = options.nlinkKey, nlinkKey = _e === void 0 ? "nlink" : _e, _f = options.uidKey, uidKey = _f === void 0 ? "uid" : _f, _g = options.gidKey, gidKey = _g === void 0 ? "gid" : _g, _h = options.rdevKey, rdevKey = _h === void 0 ? "rdev" : _h, _j = options.blksizeKey, blksizeKey = _j === void 0 ? "blksize" : _j, _k = options.inoKey, inoKey = _k === void 0 ? "ino" : _k, _l = options.sizeKey, sizeKey = _l === void 0 ? "size" : _l, _m = options.blocksKey, blocksKey = _m === void 0 ? "blocks" : _m, _o = options.atimeMsKey, atimeMsKey = _o === void 0 ? "atimeMs" : _o, _p = options.mtimeMsKey, mtimeMsKey = _p === void 0 ? "mtimeMs" : _p, _q = options.ctimeMsKey, ctimeMsKey = _q === void 0 ? "ctimeMs" : _q, _r = options.birthtimeMsKey, birthtimeMsKey = _r === void 0 ? "birthtimeMs" : _r, _s = options.atimeKey, atimeKey = _s === void 0 ? "atime" : _s, _t = options.mtimeKey, mtimeKey = _t === void 0 ? "mtime" : _t, _u = options.ctimeKey, ctimeKey = _u === void 0 ? "ctime" : _u, _v = options.birthtimeKey, birthtimeKey = _v === void 0 ? "birthtime" : _v;
    var keyNames = {
        // tslint:disable-next-line: object-literal-sort-keys
        devKey: devKey, modeKey: modeKey, nlinkKey: nlinkKey, uidKey: uidKey, gidKey: gidKey, rdevKey: rdevKey, blksizeKey: blksizeKey, inoKey: inoKey, sizeKey: sizeKey, blocksKey: blocksKey,
        atimeMsKey: atimeMsKey, mtimeMsKey: mtimeMsKey, ctimeMsKey: ctimeMsKey, birthtimeMsKey: birthtimeMsKey, atimeKey: atimeKey, mtimeKey: mtimeKey, ctimeKey: ctimeKey, birthtimeKey: birthtimeKey,
    };
    return availableStatKeys
        .filter(function (key) { return allowedKeys.some(function (regex) { return key.match(regex); }); })
        .filter(function (key) { return !disallowedKeys.some(function (regex) { return key.match(regex); }); })
        .reduce(function (statObj, key) {
        statObj[keyNames[key + "Key"]] = stringKeyStat[key];
        return statObj;
    }, {});
};
exports.sortFolderContentList = function (absolutePath, options) {
    if (options === void 0) { options = {}; }
    return function (folderContentsList) {
        var _a = options.metaFileNames, metaFileNames = _a === void 0 ? ["meta.json"] : _a;
        return folderContentsList
            .reduce(function (sortedObj, dirent) {
            if (dirent.isDirectory()) { // folders
                sortedObj.folders.push(dirent);
            }
            else if (exports.shouldIncludeFile(dirent)) { // files
                if (exports.isJsonFile(dirent)) {
                    sortedObj.jsonFiles[dirent.name] = true;
                }
                sortedObj.fileNames.push(dirent.name);
                if (exports.isMetaFile(dirent, metaFileNames)) { // meta files
                    sortedObj.metaFiles.push({
                        contentPromise: exports.getJsonPromise(exports.readFileContents(path.resolve(absolutePath, dirent.name))),
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
};

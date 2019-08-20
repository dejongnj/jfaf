"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promisifiedNode_1 = require("./promisifiedNode");
// basic default options
exports.defaultShouldIncludeFile = function (dirent, absolutePath, options) { return true; };
exports.defaultIsMetaFile = function (dirent, absolutePath, options) {
    var _a = options.metaFileNames, metaFileNames = _a === void 0 ? ["meta.json"] : _a;
    return metaFileNames.some(function (filename) { return dirent.name === filename; });
};
// internal utility methods
exports.isJsonFile = function (dirent) { return dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/); };
exports.readFileContents = function (absolutePath) {
    try {
        return promisifiedNode_1.readFile(absolutePath);
    }
    catch (e) {
        console.log("Error tyring to read " + absolutePath);
        return Promise.resolve(Buffer.from(JSON.stringify({})));
    }
};
exports.getJson = function (content) { return JSON.parse(content.toString()); };
exports.getJsonPromise = function (contentPromise) { return contentPromise.then(exports.getJson); };
exports.pureAssign = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, [{}].concat(args));
};
exports.linkAdder = function (relativeFolderPath, options) {
    if (options === void 0) { options = {}; }
    var _a = options.filenameKey, filenameKey = _a === void 0 ? "name" : _a;
    return function (fileData) { return exports.pureAssign(fileData, { link: relativeFolderPath + "/" + fileData[filenameKey] }); };
};
exports.getStatData = function (stat, statTransform) { return statTransform(stat); };

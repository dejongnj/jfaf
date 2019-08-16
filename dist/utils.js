"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// basic default options
exports.defaultShouldIncludeFile = function (dirent, absolutePath, options) { return true; };
exports.defaultIsMetaFile = function (dirent, absolutePath, options) {
    return ["meta.json"].some(function (filename) { return dirent.name = filename; });
};
// internal utility methods
exports.isJsonFile = function (dirent) { return dirent.isFile() && !!dirent.name.toLowerCase().match(/\.json$/); };
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
exports.linkAdder = function (relativeFolderPath) {
    return function (fileData) { return exports.pureAssign(fileData, { link: relativeFolderPath + "/" + fileData.filename }); };
};
exports.getStatData = function (stat, statTransform) { return statTransform(stat); };

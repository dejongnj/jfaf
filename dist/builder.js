"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var utils_1 = require("./utils");
var count = 1;
var getFolderContents = function (rootPath, folderPath, options) {
    if (options === void 0) { options = {}; }
    var absolutePath = path.resolve(rootPath, folderPath);
    return fs.promises.readdir(absolutePath, { withFileTypes: true })
        .then(function (folderContentsList) {
        // sort folder contents into files folders and meta files
        console.log(utils_1.sortFolderContentList);
        var _a = utils_1.sortFolderContentList(absolutePath)(folderContentsList), fileNames = _a.fileNames, folders = _a.folders, jsonFiles = _a.jsonFiles, metaFiles = _a.metaFiles;
        var filePromises = fileNames.map(function (filename) {
            var jsonFileName = filename + ".json";
            return new Promise(function (resolve, reject) {
                if (!jsonFiles[jsonFileName])
                    resolve({});
                else
                    resolve(utils_1.getJsonPromise(utils_1.readFileContents(path.resolve(absolutePath, jsonFileName))));
            })
                .then(function (metaData) {
                if (metaData === void 0) { metaData = {}; }
                return utils_1.pureAssign(metaData, { filename: filename });
            })
                .then(utils_1.linkAdder(folderPath));
        });
        var folderPromises = folders.map(function (dirent) {
            var _folderName = dirent.name;
            var _folderPath = folderPath + "/" + dirent.name;
            return builder(_folderPath).then(function (folderJson) { return utils_1.pureAssign({ _folderName: _folderName, _folderPath: _folderPath }, folderJson); });
        });
        return { filePromises: filePromises, folderPromises: folderPromises, jsonFiles: jsonFiles, metaFiles: metaFiles };
    })
        .catch(function (err) { return console.log(err); });
};
var builder = function (folderPath, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, rootPath, folderContent, metaDataPromises, filesPromise, foldersPromise, _b, metaData, files, folders;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = options.rootPath, rootPath = _a === void 0 ? process.cwd() : _a;
                    return [4 /*yield*/, getFolderContents(rootPath, folderPath)];
                case 1:
                    folderContent = _c.sent();
                    metaDataPromises = Promise.all(folderContent.metaFiles.map(function (file) { return file.contentPromise; }));
                    filesPromise = Promise.all(folderContent.filePromises);
                    foldersPromise = Promise.all(folderContent.folderPromises);
                    return [4 /*yield*/, Promise.all([metaDataPromises, filesPromise, foldersPromise])];
                case 2:
                    _b = _c.sent(), metaData = _b[0], files = _b[1], folders = _b[2];
                    return [2 /*return*/, utils_1.pureAssign.apply(void 0, metaData.concat([{ files: files, folders: folders }]))];
            }
        });
    });
};
exports.default = builder;

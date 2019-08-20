"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
var versionMatch = process.version.match(/\d\d?/);
var version = (versionMatch && +versionMatch[0]) || 0;
if (version < 8) {
    throw new Error("Need node 8 or above to use this library.");
}
exports.readFile = util.promisify(fs.readFile);
exports.readdir = util.promisify(fs.readdir);
exports.stat = util.promisify(fs.stat);

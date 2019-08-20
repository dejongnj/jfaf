"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
describe("builder", function () {
    describe("builder && getFolderContents", function () {
        /*
          This is in reality one big function split into two.
          Testing them separately is testing implementation details instead of output.
        */
        it("should do something", function () {
            assert.equal(true, true);
        });
    });
    describe("sortFolderContentList", function () {
        /*
          Though this can be considered as a part of the larger function,
          it is a utility function that will require expected output for certain inputs
          It forms a neat unit of code by itself, and should be tested as such.
        */
        it("should do something", function () {
            assert.equal(true, true);
        });
    });
});

import * as assert from "assert";
import builder from "./builder";

describe("builder", () => {
  describe("builder && getFolderContents", () => {
    /*
      This is in reality one big function split into two.
      Testing them separately is testing implementation details instead of output.
    */
    it("should do something", () => {
      assert.equal(true, true);
    });
  });

  describe("sortFolderContentList", () => {
    /*
      Though this can be considered as a part of the larger function,
      it is a utility function that will require expected output for certain inputs
      It forms a neat unit of code by itself, and should be tested as such.
    */
    it("should do something", () => {
      assert.equal(true, true);
    });
  });
});

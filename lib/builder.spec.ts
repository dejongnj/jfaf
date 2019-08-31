import * as assert from "assert";
import { expectArray, expectEqualStrings, expectLength,
    expectObjectToHaveKey, keyTesterCreator, objectsArrayKeyMatchCreator } from "../test/testhelpers";
import builder from "./builder";
const TEST_FOLDER_1_PATH = "./test/test-folder-structures/testFolder1";

const testFolderData = {
  ROOT_FOLDER_CHILD_FOLDER_NAMES: ["child1", "child2", "child3"],
  ROOT_FOLDER_FILENAMES: ["meta.json", "testFolder1-File1.md", "testFolder1-File2.md"],
  ROOT_FOLDER_FILES_LENGTH: 3,
  ROOT_FOLDER_FOLDERS_LENGTH: 3,
  ROOT_NAME: "testFolder1",
};

const DEFAULT_FOLDER_PROPS = [ "dev", "mode", "nlink", "uid", "gid", "rdev", "blksize",
  "ino", "size", "blocks", "atimeMs", "mtimeMs", "ctimeMs", "birthtimeMs", "atime", "mtime",
  "ctime", "birthtime"];
const DEFAULT_FILE_PROPS = [ "dev", "mode", "nlink", "uid", "gid", "rdev", "blksize", "ino", 
  "size", "blocks", "atimeMs", "mtimeMs", "ctimeMs", "birthtimeMs", "atime", "mtime", "ctime",
  "birthtime", "name", "link",
];

const eachFolderHasKeys = keyTesterCreator(DEFAULT_FOLDER_PROPS);
const eachFileHasKeys = keyTesterCreator(DEFAULT_FILE_PROPS);
const namePropertyCheck = objectsArrayKeyMatchCreator("name");

describe("builder", () => {
  describe("builder && getFolderContents", () => {
    /*
      This is in reality one big function split into two.
      Testing them separately is testing implementation details instead of output.
    */
    describe.only("default without options", () => {
      let testFolder1: any;
      before(async () => {
        testFolder1 = await builder(TEST_FOLDER_1_PATH);
      });

      it("should have some basic info about the folder", () => {
        DEFAULT_FOLDER_PROPS.forEach((prop: string) => {
          expectObjectToHaveKey(testFolder1, prop);
        });
      });

      it("should contain a folders Array with length 3", async () => {
        const { folders } = testFolder1;
        expectArray(folders, "folders");
        expectLength(folders, testFolderData.ROOT_FOLDER_FOLDERS_LENGTH);
      });

      it("should contain an array of folders with basic info about each folder", async () => {
        const { folders } = testFolder1;
        eachFolderHasKeys(folders);
      });

      it("should contain correct folder namesin root folder folders array", () => {
        const { folders } = testFolder1;
        const folderNamesCheck = namePropertyCheck(testFolderData.ROOT_FOLDER_CHILD_FOLDER_NAMES);
        assert(folders.every(folderNamesCheck), "root folder child folders name property should match");
      });

      it("should contain a files Array with length 3", async () => {
        const { files } = testFolder1;
        expectArray(files, "files");
        expectLength(files, testFolderData.ROOT_FOLDER_FILES_LENGTH);
      });

      it("should contain an array of files with basic info about each file", async () => {
        const { files } = testFolder1;
        eachFileHasKeys(files);
      });

      it("should contain correct file names in root folder files array", () => {
        const { files } = testFolder1;
        const fileNamesCheck = namePropertyCheck(testFolderData.ROOT_FOLDER_FILENAMES);
        assert(files.every(fileNamesCheck), "root folder files name property should match");
      });
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

import builder from "./builder";

const creator = async () => {
  const a = await builder("test/test-folder-structures/test1 - default",
  {
    filenameKey: "HEEEEEEE",
    folderNameKey: "DIRECTORY",
    folderPathKey: "PATH",
    metaFileNames: ["meta2.json"],
  });
  console.log(a);
};

creator();
module.exports = creator;

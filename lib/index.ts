import builder from "./builder";

const creator = async () => {
  const a = await builder("test/test-folder-structures/test1 - default",
  { });
  console.log(a);
};

creator();
module.exports = creator;

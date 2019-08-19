# JFAF - JSON Files And Folders

Jfaf (pronounced jay-faf) is a library that builds a JSON representation of a set of folders. It's initial version (pre 0.1)makes use of Node's promises apis for fs (as in fs.promises[methodName]), but a rewrite to make use of the default asynchronous fs api with callbacks is in the works.

It's usage is fairly straight forward:

```
npm install jfaf
```

```
// in a js file
const jfaf = require('jfaf')

const structurePromise = jfaf('relative/to/root/folder')
  .then(structure => {
    console.log(structure) // should log a JS object to console
  })

// if you need to save the structure

jfaf('relative/to/root/folder')
  .then(structure => {
    console.log(structure) // should log a JS object to console
    fs.writeFile(
      'outputfile/path/and/name.json',
      JSON.stringify(structure)
       err => {
        console.log('there was an error writing the file')
        console.log(err)
      }
    );
  });
```
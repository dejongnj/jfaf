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

## Todos

### Write tests
### convert to not using fs.promises
### write documentation for options object
### add more functionality
- ability to create ids on certain fields in json object (not writing to any files in the folders), if they don't exist already - also ability to overwrite those ids if they exist
- add optional output file field which automatically creates JSON file of jfaf output
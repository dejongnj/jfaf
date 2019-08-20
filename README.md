# JFAF - JSON Files And Folders
## Prerequisites and dependencies
- requires node 8 or above
## Introduction

Jfaf (pronounced jay-faf) is a library that builds a JSON representation of a set of folders. It makes use of Node's util.promisify to use promisified versions of `fs.readdir`, `fs.readFile` and `fs.stat` metods.

## Usage

```
jfaf(path[, options])
```

It's usage is fairly straight forward; import and pass it relative folder path for which you want to create a json representation. ***(folder path is relative to root folder from where process is run).*** You can also pass it an additional second options argument. For example:

On the command line, install jfaf:
```
npm install jfaf
```

Usage it in a js file:
```
const jfaf = require('jfaf')

const structurePromise = jfaf('relative/to/root/folder')
  .then(structure => {
    console.log(structure) // should log a JS object to console
  })
```

```
// if you need to save the structure
const fs = require('fs')
const jfaf = require('jfaf')

jfaf('relative/to/root/folder')
  .then(structure => {
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
### write documentation for options object
### add more functionality
- ability to create ids on certain fields in json object (not writing to any files in the folders), if they don't exist already - also ability to overwrite those ids if they exist
- add optional output file field which automatically creates JSON file of jfaf output
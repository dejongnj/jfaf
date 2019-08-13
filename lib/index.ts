import builder from './builder'

interface GlobalOptionsObject {
  rootDir:string
}

// interface IPerson { 
//   firstName:string, 
//   lastName:string, 
//   sayHi: ()=>string 
// } 

const creator = async () => {
  const a = await builder('test/test-folder-structures/test1 - default', {})
  console.log(a)
} 

creator()
module.exports = creator
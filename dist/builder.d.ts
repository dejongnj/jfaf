interface IBuildOptions {
    rootPath?: string;
    filenameKey?: string;
    metaFileNames?: string[];
}
declare const builder: (folderPath: string, options?: IBuildOptions) => Promise<any>;
export default builder;

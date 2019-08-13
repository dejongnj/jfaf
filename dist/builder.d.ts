interface buildOptions {
    rootPath?: string;
}
declare const builder: (folderPath: string, options?: buildOptions) => Promise<any>;
export default builder;

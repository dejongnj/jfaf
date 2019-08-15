export interface IStatKeys {
    allowedKeys?: Array<RegExp | string>;
    disallowedKeys?: Array<RegExp | string>;
    devKey?: string;
    modeKey?: string;
    nlinkKey?: string;
    uidKey?: string;
    gidKey?: string;
    rdevKey?: string;
    blksizeKey?: string;
    inoKey?: string;
    sizeKey?: string;
    blocksKey?: string;
    atimeMsKey?: string;
    mtimeMsKey?: string;
    ctimeMsKey?: string;
    birthtimeMsKey?: string;
    atimeKey?: string;
    mtimeKey?: string;
    ctimeKey?: string;
    birthtimeKey?: string;
}
export interface IAnyObject {
    [propName: string]: any;
}
export interface IBuildOptions {
    rootPath?: string;
    filenameKey?: string;
    folderNameKey?: string;
    folderPathKey?: string;
    metaFileNames?: string[];
    statKeys?: IStatKeys;
}

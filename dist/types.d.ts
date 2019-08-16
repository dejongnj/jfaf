/// <reference types="node" />
import * as fs from "fs";
export interface IAnyObject {
    [propName: string]: any;
}
export interface IOnlyTrueObject {
    [propName: string]: boolean;
}
export interface IJsonResponse {
    [key: string]: any;
}
export interface IMetaFilesData {
    filename: string;
    contentPromise: Promise<IAnyObject>;
}
export interface IBuildOptions {
    rootPath?: string;
    filenameKey?: string;
    folderNameKey?: string;
    folderPathKey?: string;
    isMetaFile?: IIsMetaFile;
    metaFileNames?: string[];
    shouldIncludeFile?: IShouldIncludeFile;
    statTransform?: IStatTransform;
}
export interface ISortedFolderContentList {
    filenames: string[];
    folders: fs.Dirent[];
    jsonFiles: IOnlyTrueObject;
    metaFiles: IMetaFilesData[];
}
export interface IGetFolderContentResponse {
    filePromises: Array<Promise<IAnyObject>>;
    folderPromises: Array<Promise<IAnyObject>>;
    jsonFiles: IAnyObject;
    metaFiles: IMetaFilesData[];
}
export declare type IStatTransform = (stat: fs.Stats) => IAnyObject;
export declare type IShouldIncludeFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => boolean;
export declare type IIsMetaFile = (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => boolean;

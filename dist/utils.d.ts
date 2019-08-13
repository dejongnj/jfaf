/// <reference types="node" />
import * as fs from 'fs';
export declare const shouldIncludeFile: (dirent: fs.Dirent, prohibitedList?: (string | RegExp)[]) => boolean;
export declare const isMetaFile: (dirent: fs.Dirent, metaFiles?: string[]) => boolean;
export declare const isJsonFile: (dirent: fs.Dirent) => boolean;
export declare const readFileContents: (absolutePath: string) => Promise<Buffer>;
export declare const getJson: (content: Buffer) => any;
export declare const getJsonPromise: (contentPromise: Promise<Buffer>) => Promise<any>;
export declare const pureAssign: (...args: any) => any;
export declare const linkAdder: (relativeFolderPath: string) => (fileData: any) => any;
export declare const sortFolderContentList: (absolutePath: string) => (folderContentsList: any[]) => any;

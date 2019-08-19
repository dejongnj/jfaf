/// <reference types="node" />
import * as fs from "fs";
import { IAnyObject, IBuildOptions, IStatTransform } from "./types";
export declare const defaultShouldIncludeFile: (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => boolean;
export declare const defaultIsMetaFile: (dirent: fs.Dirent, absolutePath: string, options: IBuildOptions) => boolean;
export declare const isJsonFile: (dirent: fs.Dirent) => boolean;
export declare const readFileContents: (absolutePath: string) => Promise<Buffer>;
export declare const getJson: (content: Buffer) => any;
export declare const getJsonPromise: (contentPromise: Promise<Buffer>) => Promise<IAnyObject>;
export declare const pureAssign: (...args: any) => any;
export declare const linkAdder: (relativeFolderPath: string, options?: IBuildOptions) => (fileData: any) => any;
export declare const getStatData: (stat: fs.Stats, statTransform: IStatTransform) => IAnyObject;

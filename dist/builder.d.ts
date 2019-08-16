import { IBuildOptions, IJsonResponse, ISortedFolderContentList } from "./types";
export declare const sortFolderContentList: (absolutePath: string, options?: IBuildOptions) => (folderContentsList: any[]) => ISortedFolderContentList;
declare const builder: (folderPath: string, options?: IBuildOptions) => Promise<IJsonResponse>;
export default builder;

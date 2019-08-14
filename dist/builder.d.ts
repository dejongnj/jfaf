import { IBuildOptions } from "./types";
interface IBuilderResponse {
    [key: string]: any;
}
declare const builder: (folderPath: string, options?: IBuildOptions) => Promise<IBuilderResponse>;
export default builder;

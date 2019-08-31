import * as assert from "assert";
import { IAnyObject } from "../lib/types";

const errorStart = (value: any, name?: string) => `expected${name ? ` ${name},` : ","} ${value},`;
const errorResult = (value: any) => `instead got ${value}`;

export const expectArray = (value: any, name?: string) => {
  const message = `${errorStart(value, name)} to be an array; ${errorResult(typeof value)}`;
  assert(Array.isArray(value), message);
};

export const expectLength = (value: any, length: number, name?: string) => {
  const message = `${errorStart(value, name)} to have length ${length}; ${errorResult(`length ${value.length}`)}`;
  assert(value.length === length, message);
};

export const expectEqualStrings = (testString: string, expectedString: string) => {
  const message = `${errorStart(`"${testString}"`)} to be "${expectedString}"`;
  assert.equal(testString, expectedString, message);
};

export const expectObjectToHaveKey = (object: IAnyObject, key: string) => {
  const message = `${errorStart(object)} to have key, "${key}"; instead got false`;
  assert(!!object.hasOwnProperty(key), message);
};

export const keyTesterCreator = (keysArray: string[]) => {
  return (objectsArray: IAnyObject[]) => {
    objectsArray.forEach((object: IAnyObject) => {
      keysArray.forEach((key: string) => expectObjectToHaveKey(object, key));
    });
  };
};

export const objectPropertyMatch = (object: IAnyObject, key: string, value: any) => {
  return object.hasOwnProperty(key) && object[key] === value;
};

export const objectsArrayKeyMatchCreator = (key: string) => (keyValueList: string[]) =>
  (object: IAnyObject) => keyValueList.some((value) => objectPropertyMatch(object, key, value));

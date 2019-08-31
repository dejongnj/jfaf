import * as assert from "assert";

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

export const expectObjectToHaveKey = (object: any, key: string) => {
  const message = `${errorStart(object)} to have key, "${key}"; instead got false`;
  assert(!!object.hasOwnProperty(key), message);
}

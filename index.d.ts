// index.d.ts

// 根据 `parseResource` 的实际实现定义它的类型
declare function parseResource(input: string): any; // 根据实际返回类型进行调整

// 根据 `ParseData` 类的实现定义它的类型
declare class ParseData {
  constructor(data: any);
  // 根据类的实际方法和属性定义类型
}

// `decrypt` 和 `encrypt` 函数的类型
declare function decrypt(data: string): string;
declare function encrypt(data: string): string;

export { parseResource, ParseData, decrypt, encrypt };

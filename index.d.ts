declare module './index' {
  export function parseResource(urlStr: string): ParseData;

  export class ParseData {
    scheme: string;
    addrs: string[];
    user: string | null;
    password: string | null;
    uri: string;
    params: Record<string, string>;
    getAddrInline(): string;
  }

  export function decrypt(data: string): string; // 假设 decrypt 函数的返回类型是 string
  export function encrypt(data: string): string; // 假设 encrypt 函数的返回类型是 string
}

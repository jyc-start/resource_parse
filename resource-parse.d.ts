declare module 'resource-parse' {
  export function parseResource(urlStr: string, key: string): ParseData;

  export class ParseData {
    scheme: string;
    addrs: string[];
    user: string | null;
    password: string | null;
    uri: string;
    params: Record<string, string>;
    getAddrInline(): string;
  }
}

const { decrypt } = require('./crypto');
const querystring = require('querystring');

class ParseData {
  constructor(scheme, addrs, user, password, uri, params) {
    this.scheme = scheme;
    this.addrs = addrs;
    this.user = user;
    this.password = password;
    this.uri = uri;
    this.params = params;
  }

  getAddrInline () {
    return this.addrs.join(',');
  }
}

function formatQueries (rawQueries) {
  const formatted = {};
  for (const [key, value] of Object.entries(rawQueries)) {
    formatted[key] = Array.isArray(value) ? value.join(',') : value;
  }
  return formatted;
}

function parseResource (nowUri, key) {
  try {
    // 解码
    let urlStr = nowUri
    if (nowUri.startsWith('encrypted://')) {
      try {
        urlStr = decrypt(key, nowUri);
      } catch (err) {
        console.error('Error during decryption:', err.message);
        throw new Error(`decryptedData failed: ${err.message}`);
      }
    }
    // 解析 scheme
    const schemeEnd = urlStr.indexOf("://");
    if (schemeEnd === -1) throw new Error("Invalid URL scheme");
    const scheme = urlStr.slice(0, schemeEnd);

    // 移除 scheme 后的 URL
    let rest = urlStr.slice(schemeEnd + 3);

    // 解析用户信息（用户名和密码）
    let user = null;
    let password = null;
    const atIndex = rest.indexOf('@');
    if (atIndex !== -1) {
      const userInfo = rest.slice(0, atIndex);
      rest = rest.slice(atIndex + 1);
      const [username, pwd] = userInfo.split(':');
      user = username || null;
      password = pwd || null;
    }

    // 解析地址（多个 ip:port）
    const pathStart = rest.indexOf('/');
    const addrPart = pathStart !== -1 ? rest.slice(0, pathStart) : rest;
    const addrs = addrPart.split(',');

    // 解析 URI 和查询参数
    let uri = '';
    let params = {};
    if (pathStart !== -1) {
      const pathAndQuery = rest.slice(pathStart);
      const [path, queryString] = pathAndQuery.split('?');
      uri = path.slice(1);
      if (queryString) {
        params = formatQueries(querystring.parse(queryString));
      }
    }

    return new ParseData(scheme, addrs, user, decodeURIComponent(password), uri, params);
  } catch (error) {
    console.error(error)
    throw new Error("can not parse this format: " + error.message);
  }
}

module.exports = { parseResource, ParseData };

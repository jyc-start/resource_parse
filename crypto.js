const crypto = require('crypto');

// 密钥常量
const EncryptedPrefix = 'encrypted://';

// 生成 MD5 哈希作为密钥
function preparePassword(password) {
  return crypto.createHash('md5').update(password).digest();
}

// HMAC-SHA256 加密和 AES 加密
function encrypt(key, data) {
  // 创建 HMAC-SHA256 签名
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  const sign = hmac.digest();

  // AES 加密
  const encrypted = aesEncrypt(key, Buffer.from(data));

  // 返回 Base64 编码后的结果
  return EncryptedPrefix + Buffer.concat([sign, encrypted]).toString('base64');
}

// HMAC-SHA256 解密和 AES 解密
function decrypt(key, data) {
  if (!data.startsWith(EncryptedPrefix)) {
    return data; // 如果没有加密前缀，直接返回
  }

  data = data.slice(EncryptedPrefix.length);
  const binaryData = Buffer.from(data, 'base64');

  const sign = binaryData.slice(0, 32); // 提取签名
  const encrypted = binaryData.slice(32); // 提取加密数据

  const decrypted = aesDecrypt(key, encrypted);

  // 验证 HMAC-SHA256
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(decrypted);
  if (!hmac.digest().equals(sign)) {
    throw new Error('Decrypt failed: HMAC-SHA256 signature verification failed');
  }

  return decrypted.toString();
}

// AES 加密
function aesEncrypt(key, data) {
  const aesBlockSize = 16;
  const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
  cipher.setAutoPadding(false);

  // 添加 PKCS#7 填充
  const paddingLen = aesBlockSize - (data.length % aesBlockSize);
  const padding = Buffer.alloc(paddingLen, paddingLen);
  data = Buffer.concat([data, padding]);

  return Buffer.concat([cipher.update(data), cipher.final()]);
}

// AES 解密
function aesDecrypt(key, data) {
  const aesBlockSize = 16;
  const cipher = crypto.createDecipheriv('aes-128-ecb', key, null);
  cipher.setAutoPadding(false);

  const decrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  // 去除 PKCS#7 填充
  const paddingLen = decrypted[decrypted.length - 1];
  return decrypted.slice(0, decrypted.length - paddingLen);
}

module.exports = {decrypt, encrypt}; 

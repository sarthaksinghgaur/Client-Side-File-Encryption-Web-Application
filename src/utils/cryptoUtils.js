import CryptoJS from "crypto-js";

// AES encryption
export const encryptAES = (arrayBuffer, password, fileName) => {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();
  return new Blob([encrypted], { type: "text/plain" });
};

// AES decryption
export const decryptAES = (encryptedBase64, password) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, password);
  const words = decrypted.words;
  const sigBytes = decrypted.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return new Blob([u8]);
};
// Generate RSA key pair
export const generateRSAKeys = async (setPublicKey, setPrivateKey) => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  setPublicKey(keyPair.publicKey);
  setPrivateKey(keyPair.privateKey);
  alert("RSA key pair generated!");
};

// Export public key to PEM
export const exportPublicKey = async (key) => {
  const spki = await window.crypto.subtle.exportKey("spki", key);
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;
  return pem;
};

// Export private key to PEM
export const exportPrivateKey = async (key) => {
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", key);
  const b64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
  const pem = `-----BEGIN PRIVATE KEY-----\n${b64.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----`;
  return pem;
};

// RSA encrypt file (hybrid encryption)
export const rsaEncryptFile = async (file, publicKey) => {
  const arrayBuffer = await file.arrayBuffer();
  const aesKey = window.crypto.getRandomValues(new Uint8Array(32));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const aesKeyObj = await window.crypto.subtle.importKey("raw", aesKey, "AES-GCM", true, ["encrypt", "decrypt"]);
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKeyObj,
    arrayBuffer
  );
  const encryptedAesKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    aesKey
  );
  const combined = new Uint8Array(
    encryptedAesKey.byteLength + iv.byteLength + encryptedContent.byteLength
  );
  combined.set(new Uint8Array(encryptedAesKey), 0);
  combined.set(iv, encryptedAesKey.byteLength);
  combined.set(new Uint8Array(encryptedContent), encryptedAesKey.byteLength + iv.byteLength);
  return new Blob([combined], { type: "application/octet-stream" });
};

// RSA decrypt file (hybrid decryption)
export const rsaDecryptFile = async (file, privateKey) => {
  const arrayBuffer = await file.arrayBuffer();
  const encryptedAesKeyLength = 256; // RSA 2048 bits = 256 bytes
  const encryptedAesKey = arrayBuffer.slice(0, encryptedAesKeyLength);
  const iv = arrayBuffer.slice(encryptedAesKeyLength, encryptedAesKeyLength + 12);
  const encryptedContent = arrayBuffer.slice(encryptedAesKeyLength + 12);
  const aesKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedAesKey
  );
  const aesKeyObj = await window.crypto.subtle.importKey("raw", aesKey, "AES-GCM", true, ["decrypt"]);
  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    aesKeyObj,
    encryptedContent
  );
  return new Blob([decryptedContent]);
};
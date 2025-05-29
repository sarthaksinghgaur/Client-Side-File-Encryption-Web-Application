import { useState } from "react";
import { encryptAES, decryptAES } from "./utils/cryptoUtils";
import {
  generateRSAKeys,
  rsaEncryptFile,
  rsaDecryptFile,
  exportPublicKey,
  exportPrivateKey,
} from "./utils/rsaUtils";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptionMode, setEncryptionMode] = useState("AES"); // default to AES

  const handleEncrypt = () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const blob = encryptAES(reader.result, password);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = file.name + ".enc";
        link.click();
      } catch (error) {
        alert("AES encryption failed!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDecrypt = () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const blob = decryptAES(reader.result, password);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = file.name.replace(".enc", "");
        link.click();
      } catch (error) {
        alert("AES decryption failed! Check your password and try again.");
      }
    };
    reader.readAsText(file); // read as text because encrypted data is Base64
  };

  return (
    <div className="App">
      <h1>Client-Side File Encryption Web Application</h1>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="encryptionMode"
            value="AES"
            checked={encryptionMode === "AES"}
            onChange={() => setEncryptionMode("AES")}
          />
          AES (Password-based)
        </label>
        <label>
          <input
            type="radio"
            name="encryptionMode"
            value="RSA"
            checked={encryptionMode === "RSA"}
            onChange={() => setEncryptionMode("RSA")}
          />
          RSA (Key-based)
        </label>
      </div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {encryptionMode === "AES" && (
        <section>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              onClick={handleEncrypt}
              disabled={!file || !password}
            >
              Encrypt
            </button>
            <button
              onClick={handleDecrypt}
              disabled={!file || !password}
            >
              Decrypt
            </button>
          </div>
        </section>
      )}
      {encryptionMode === "RSA" && (
        <section>
          <div>
            <button onClick={() => generateRSAKeys(setPublicKey, setPrivateKey)}>
              Generate RSA Key Pair
            </button>
          </div>
          <div>
            <button
              onClick={async () => {
                if (!file || !publicKey) {
                  alert("Select file & generate keys first.");
                  return;
                }
                const blob = await rsaEncryptFile(file, publicKey);
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name + ".rsa.enc";
                link.click();
              }}
              disabled={!file || !publicKey}
            >
              RSA Encrypt
            </button>
            <button
              onClick={async () => {
                if (!file || !privateKey) {
                  alert("Select file & generate keys first.");
                  return;
                }
                try {
                  const blob = await rsaDecryptFile(file, privateKey);
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = file.name.replace(".rsa.enc", "");
                  link.click();
                } catch (error) {
                  alert("RSA decryption failed! The key might not match the file.");
                }
              }}
              disabled={!file || !privateKey}
            >
              RSA Decrypt
            </button>
          </div>
          {publicKey && (
            <div>
              <h3>Public Key (PEM):</h3>
              <textarea
                readOnly
                rows={10}
                cols={60}
                onFocus={async (e) => {
                  const pem = await exportPublicKey(publicKey);
                  e.target.value = pem;
                }}
              />
            </div>
          )}
          {privateKey && (
            <div>
              <h3>Private Key (PEM):</h3>
              <textarea
                readOnly
                rows={10}
                cols={60}
                onFocus={async (e) => {
                  const pem = await exportPrivateKey(privateKey);
                  e.target.value = pem;
                }}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
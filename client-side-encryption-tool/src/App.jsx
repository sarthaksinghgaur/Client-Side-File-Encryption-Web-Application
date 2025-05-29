import { useState } from "react";
import CryptoJS from "crypto-js";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");

  const handleEncrypt = () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();

      const blob = new Blob([encrypted], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name + ".enc";
      link.click();
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
      const encrypted = reader.result;
      const decrypted = CryptoJS.AES.decrypt(encrypted, password);
      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

      const blob = new Blob([decryptedData], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name.replace(".enc", "");
      link.click();
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <h1>Client-Side File Encryption Tool</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>
    </div>
  );
}

export default App;
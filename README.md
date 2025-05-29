# Client-Side File Encryption Web Application

A secure, browser-based file encryption and decryption tool built with React that performs **all cryptographic operations client-side** to ensure your data privacy. This tool supports both **AES (password-based symmetric encryption)** and **RSA (asymmetric hybrid encryption)**.

---

## Features

- **Client-side encryption and decryption** — no data is ever sent to a server.
- Supports **AES encryption** using a password.
- Supports **RSA encryption** with generated public/private key pairs.
- Hybrid RSA + AES encryption for secure file handling of any size.
- Export RSA keys in PEM format.
- Clean and modern React-based UI with mode toggling.
- Responsive design with user-friendly feedback and error handling.

---

## Technologies Used

- React  
- CryptoJS (for AES encryption)  
- Web Crypto API (for RSA key generation and encryption)  
- Modern CSS for styling

---

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sarthaksinghgaur/Client-Side-File-Encryption-Web-Application.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173` (or the port shown in the console).

---

## Usage

1. Choose your encryption mode:  
   - **AES:** Encrypt/decrypt files using a password.  
   - **RSA:** Generate RSA key pairs and encrypt/decrypt files with public/private keys.

2. Select a file to encrypt or decrypt.

3. For AES mode: Enter a password to encrypt/decrypt your file.

4. For RSA mode:  
   - Generate an RSA key pair.  
   - Encrypt the file using the public key.  
   - Decrypt using the private key.  
   - View and copy PEM-formatted keys in the UI.

5. Download the encrypted/decrypted file from the browser.

---

## Security Notes

- All encryption/decryption happens **locally in your browser** — no data is transmitted to any server.
- AES encryption uses CryptoJS with password-derived keys.
- RSA uses Web Crypto API’s RSA-OAEP with SHA-256 and AES-GCM hybrid encryption.
- For production or sensitive data, consider secure key management and enhanced protections.

---

## Folder Structure

```

├── public/
├── src/
│   ├── utils/
│   │   ├── cryptoUtils.js    # AES encryption utilities
│   │   └── rsaUtils.js       # RSA encryption utilities
│   ├── App.jsx               # Main React component
│   ├── App.css               # Styling
│   └── main.jsx              # React app entry
├── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
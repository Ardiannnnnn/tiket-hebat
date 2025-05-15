// // utils/encrypt.ts
// import CryptoJS from "crypto-js";

// const SECRET_KEY = "your-secret-key"; // simpan di ENV

// export function encryptId(id: string): string {
//   return CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
// }

// export function decryptId(encrypted: string): string {
//   const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
//   return bytes.toString(CryptoJS.enc.Utf8);
// }

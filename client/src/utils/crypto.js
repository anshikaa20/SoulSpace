// client/src/utils/crypto.js
// Secure Journal Encryption Utilities using Web Crypto API (AES-GCM + PBKDF2)

const subtle = window.crypto.subtle;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ----------------------
// 🔹 Helper conversions
// ----------------------
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// ----------------------
// 🔹 Salt + Key Derivation
// ----------------------
export function generateSaltBase64(len = 16) {
  const arr = window.crypto.getRandomValues(new Uint8Array(len));
  let binary = "";
  for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary);
}

export async function deriveKeyFromPassword(password, saltBase64, iterations = 200_000) {
  const salt = base64ToArrayBuffer(saltBase64);
  const passKey = await subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return key;
}

// ----------------------
// 🔹 Encryption
// ----------------------
export async function encryptData(plaintext) {
  try {
    let password = localStorage.getItem("journalPassword");
    let salt = localStorage.getItem("journalSalt");

    if (!password || !salt) {
      password = crypto.randomUUID(); // unique per user/device
      salt = generateSaltBase64();
      localStorage.setItem("journalPassword", password);
      localStorage.setItem("journalSalt", salt);
    }

    const key = await deriveKeyFromPassword(password, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(plaintext);
    const encrypted = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

    return {
      encryptedData: arrayBufferToBase64(encrypted),
      iv: arrayBufferToBase64(iv),
    };
  } catch (err) {
    console.error("Encryption failed:", err);
    throw new Error("Encryption failed");
  }
}

// ----------------------
// 🔹 Decryption
// ----------------------
export async function decryptData(ciphertextBase64, ivBase64) {
  try {
    const password = localStorage.getItem("journalPassword");
    const salt = localStorage.getItem("journalSalt");

    if (!password || !salt) throw new Error("Missing encryption key material");

    const key = await deriveKeyFromPassword(password, salt);
    const ciphertext = base64ToArrayBuffer(ciphertextBase64);
    const iv = base64ToArrayBuffer(ivBase64);

    const decrypted = await subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      ciphertext
    );

    return decoder.decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    return "[Decryption Error]";
  }
}

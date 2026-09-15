// src/utils/crypto.js

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

/**
 * Derives initial key material from a plain text password.
 */
async function getPasswordKey(password) {
  return window.crypto.subtle.importKey(
    "raw",
    ENCODER.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
}

/**
 * Encrypts a string payload into a packaged Uint8Array containing:
 * [Salt (16 bytes)] + [IV (12 bytes)] + [Ciphertext (Variable)]
 */
export async function encryptPayload(plaintext, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await getPasswordKey(password);
  
  // Stretch the password into a secure 256-bit AES key
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    ENCODER.encode(plaintext)
  );

  // Package everything into a single byte array for the LSB injector
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const packagedBuffer = new Uint8Array(16 + 12 + encryptedArray.length);
  packagedBuffer.set(salt, 0);
  packagedBuffer.set(iv, 16);
  packagedBuffer.set(encryptedArray, 28);
  
  return packagedBuffer;
}

/**
 * Unpacks the array, derives the key, and decrypts the ciphertext.
 */
export async function decryptPayload(packagedData, password) {
  const dataArray = new Uint8Array(packagedData);
  
  // Extract the headers
  const salt = dataArray.slice(0, 16);
  const iv = dataArray.slice(16, 28);
  const ciphertext = dataArray.slice(28);

  const keyMaterial = await getPasswordKey(password);
  
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return DECODER.decode(decryptedBuffer);
}
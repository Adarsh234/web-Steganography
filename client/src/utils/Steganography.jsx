const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

// ==========================================
// 1. CRYPTOGRAPHY UTILITIES
// ==========================================

/**
 * Derives initial key material from a password string.
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
 * Encrypts a string and packages it as: [Salt(16)] + [IV(12)] + [Ciphertext]
 */
async function encryptPayload(plaintext, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await getPasswordKey(password);
  
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

  const encryptedArray = new Uint8Array(encryptedBuffer);
  const packagedBuffer = new Uint8Array(16 + 12 + encryptedArray.length);
  packagedBuffer.set(salt, 0);
  packagedBuffer.set(iv, 16);
  packagedBuffer.set(encryptedArray, 28);
  
  return packagedBuffer;
}

/**
 * Unpacks the payload and decrypts the ciphertext.
 */
async function decryptPayload(packagedData, password) {
  const dataArray = new Uint8Array(packagedData);
  
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

// ==========================================
// 2. IMAGE HELPERS
// ==========================================

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
};

// ==========================================
// 3. STEGANOGRAPHY ENGINE
// ==========================================

/**
 * Encodes a secure, encrypted message into an image.
 * @param {string} message - Secret message to hide.
 * @param {string} imageDataUrl - Base64 or URL of the cover image.
 * @param {string} password - AES-GCM encryption password.
 * @returns {Promise} - Base64 PNG data URL of the encoded image.
 */
export async function encodeMessageInImage(message, imageDataUrl, password) {
  if (!password) throw new Error("An encryption password is required.");

  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // 1. Encrypt the payload
  const encryptedBytes = await encryptPayload(message, password);
  const payloadLength = encryptedBytes.length;

  // 2. Prefix with a 32-bit (4-byte) length header
  const lengthBytes = new Uint8Array([
    (payloadLength >> 24) & 255,
    (payloadLength >> 16) & 255,
    (payloadLength >> 8) & 255,
    payloadLength & 255
  ]);

  const fullPackage = new Uint8Array(4 + payloadLength);
  fullPackage.set(lengthBytes, 0);
  fullPackage.set(encryptedBytes, 4);

  // 3. Convert package to bit array
  const messageBits = [];
  for (let i = 0; i < fullPackage.length; i++) {
    const byte = fullPackage[i];
    for (let bit = 7; bit >= 0; bit--) {
      messageBits.push((byte >> bit) & 1);
    }
  }

  // Check capacity: each pixel has 1 usable red-channel bit (data.length / 4 total pixels)
  if (messageBits.length > data.length / 4) {
    throw new Error("Encrypted payload exceeds the maximum storage capacity of this image.");
  }

  // 4. Embed bits into the LSB of the Red channel
  for (let i = 0; i < messageBits.length; i++) {
    const pixelIndex = i * 4; // Target red channel
    data[pixelIndex] = (data[pixelIndex] & ~1) | messageBits[i];
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Extracts and decrypts a hidden message from an image.
 * @param {string} imageDataUrl - Base64 or URL of the encoded image.
 * @param {string} password - AES-GCM decryption password.
 * @returns {Promise} - The extracted secret message.
 */
export async function decodeMessageFromImage(imageDataUrl, password) {
  if (!password) throw new Error("A decryption password is required.");

  const img = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  let currentByte = 0;
  let bitCount = 0;
  
  let payloadLength = 0;
  let isReadingLength = true;
  let bytesRead = 0;
  let extractedBytes = null;

  // 1. Read bits from the Red channel LSBs
  for (let i = 0; i < data.length; i += 4) {
    const lsb = data[i] & 1;
    currentByte = (currentByte << 1) | lsb;
    bitCount++;

    if (bitCount === 8) {
      if (isReadingLength) {
        payloadLength = (payloadLength << 8) | currentByte;
        bytesRead++;
        
        // After reading the 4-byte length header, initialize the payload array
        if (bytesRead === 4) {
          isReadingLength = false;
          bytesRead = 0;
          
          if (payloadLength === 0 || payloadLength > (data.length / 4 / 8) - 4) {
            throw new Error("Invalid payload signature. Image may not contain an encrypted message.");
          }
          extractedBytes = new Uint8Array(payloadLength);
        }
      } else {
        extractedBytes[bytesRead] = currentByte;
        bytesRead++;
        
        // Stop reading once we hit the target length
        if (bytesRead === payloadLength) {
          break;
        }
      }
      
      currentByte = 0;
      bitCount = 0;
    }
  }

  if (!extractedBytes || bytesRead < payloadLength) {
    throw new Error("Failed to extract full payload. Image might be corrupted.");
  }

  // 2. Decrypt the extracted package
  try {
    const decodedText = await decryptPayload(extractedBytes, password);
    return decodedText;
  } catch (err) {
    throw new Error("Decryption failed. Incorrect password or modified carrier image.");
  }
}
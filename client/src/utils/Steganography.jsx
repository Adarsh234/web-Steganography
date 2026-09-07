const TERMINATOR = "###END###";

// Helper to load an image safely inside a Promise
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
};

/**
 * Encodes a text message into an image using LSB steganography.
 * @param {string} message - Secret message to hide.
 * @param {string} imageDataUrl - Base64 or URL of the cover image.
 * @returns {Promise<string>} - Base64 PNG data URL of the encoded image.
 */
export async function encodeMessageInImage(message, imageDataUrl) {
  const img = await loadImage(imageDataUrl);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Convert payload + terminator to bit array
  const fullMessage = message + TERMINATOR;
  const messageBits = [];

  for (let i = 0; i < fullMessage.length; i++) {
    const charCode = fullMessage.charCodeAt(i);
    for (let bit = 7; bit >= 0; bit--) {
      messageBits.push((charCode >> bit) & 1);
    }
  }

  // Check capacity: each pixel has 1 usable red-channel bit (data.length / 4 total pixels)
  if (messageBits.length > data.length / 4) {
    throw new Error("Message exceeds the maximum storage capacity of this image.");
  }

  // Embed bits into the LSB of the Red channel
  for (let i = 0; i < messageBits.length; i++) {
    const pixelIndex = i * 4; // Target red channel
    data[pixelIndex] = (data[pixelIndex] & ~1) | messageBits[i];
  }

  ctx.putImageData(imgData, 0, 0);

  // Strictly return PNG to avoid lossy compression artifacts
  return canvas.toDataURL("image/png");
}

/**
 * Extracts a hidden message from an LSB-encoded image.
 * @param {string} imageDataUrl - Base64 or URL of the encoded image.
 * @returns {Promise<string>} - The extracted secret message.
 */
export async function decodeMessageFromImage(imageDataUrl) {
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
  let decodedText = "";

  // Iterate over pixels and construct characters on the fly
  for (let i = 0; i < data.length; i += 4) {
    const lsb = data[i] & 1;
    currentByte = (currentByte << 1) | lsb;
    bitCount++;

    if (bitCount === 8) {
      const char = String.fromCharCode(currentByte);
      decodedText += char;

      if (decodedText.endsWith(TERMINATOR)) {
        return decodedText.slice(0, -TERMINATOR.length);
      }

      currentByte = 0;
      bitCount = 0;
    }
  }

  throw new Error("No hidden message found with a valid terminator.");
}
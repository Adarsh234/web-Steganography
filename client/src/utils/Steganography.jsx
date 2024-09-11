//encryption function
export function encodeMessageInImage(message, imageData) {
    const terminator = "###END###";
    const fullMessage = message + terminator;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const img = new Image();
    img.src = imageData;
  
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        const messageBinary = [];
        for (let i = 0; i < fullMessage.length; i++) {
          const binaryChar = fullMessage.charCodeAt(i).toString(2).padStart(8, '0');
          messageBinary.push(...binaryChar.split('').map(Number));
        }
  
        if (messageBinary.length > data.length / 4) {
          reject(new Error("Message is too long to encode in this image."));
          return;
        }
  
        let binaryIndex = 0;
        for (let i = 0; i < data.length && binaryIndex < messageBinary.length; i += 4) {
          data[i] = (data[i] & ~1) | messageBinary[binaryIndex];
          binaryIndex++;
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      img.onerror = () => reject(new Error("Failed to load image."));
    });
  }
  
  
    
  //decryption function 
  export function decodeMessageFromImage(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const img = new Image();
    img.src = imageData;
  
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        let binaryMessage = '';
        for (let i = 0; i < data.length; i += 4) {
          binaryMessage += (data[i] & 1).toString(); // Collect the least significant bit
        }
  
        // Break binaryMessage into groups of 8 bits (1 byte)
        const bytes = binaryMessage.match(/.{1,8}/g);
        let message = '';
        let foundTerminator = false;
  
        if (bytes) {
          for (let byte of bytes) {
            const char = String.fromCharCode(parseInt(byte, 2));
            message += char;
  
            if (message.includes("###END###")) {
              message = message.replace("###END###", ''); // Remove the terminator
              foundTerminator = true;
              break;
            }
          }
          console.log(message)
        }
  
        if (!foundTerminator) {
          resolve("Error: Terminator not found in the decoded message.");
        } else {
          resolve(message);
        }
      };
    });
  }
  
  
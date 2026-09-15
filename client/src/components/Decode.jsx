"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { decodeMessageFromImage } from '../utils/Steganography.jsx';

function DecodeContent() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [password, setPassword] = useState(''); // AES Decryption Key
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const externalImageUrl = searchParams.get('imageUrl');

  // Load image from vault URL if provided via query param
  useEffect(() => {
    if (externalImageUrl) {
      setImagePreview(externalImageUrl);
      setError('');
      setDecodedMessage('');

      fetch(externalImageUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch carrier image from vault.");
          return res.blob();
        })
        .then((blob) => {
          const file = new File([blob], "vault-carrier.png", { type: blob.type });
          setImage(file);
        })
        .catch((err) => {
          console.error("Vault fetch error:", err);
          setError("Failed to load image from vault link.");
        });
    }
  }, [externalImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDecodedMessage('');
      setError('');
      setCopied(false);
    }
  };

  const handleDecode = () => {
    if (!image) {
      setError("Please select an image to extract the hidden message.");
      return;
    }

    if (!password.trim()) {
      setError("A decryption password is required to unlock the payload.");
      return;
    }

    setError('');
    setIsProcessing(true);
    setDecodedMessage('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageData = reader.result;
        // Pass the password to the upgraded decoding engine
        const message = await decodeMessageFromImage(imageData, password);

        if (!message || message.trim() === '') {
          setError("No hidden message found in this image, or it was encoded using a different method.");
          setDecodedMessage('');
        } else {
          setDecodedMessage(message);
        }
      } catch (err) {
        console.error("Decoding error:", err);
        setError(err.message || "Failed to decode message. Ensure the password is correct.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the image file.");
      setIsProcessing(false);
    };

    reader.readAsDataURL(image);
  };

  const handleCopy = () => {
    if (decodedMessage) {
      navigator.clipboard.writeText(decodedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#B5543A] mb-2">
            Decoder Workspace
          </span>
          <h1 className="text-3xl font-bold text-[#5A2E25] mb-2">
            Extract Payload
          </h1>
          <p className="text-sm text-[#5A2E25]/70">
            Reconstructs binary payloads and decrypts them using your AES-GCM secure key.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-white/60 border border-[#5A2E25]/10 rounded-3xl p-6 sm:p-8 shadow-sm">

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-6">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Carrier Image Input */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase tracking-widest text-[#5A2E25]/60 mb-2">
              Carrier Image Input
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#5A2E25]/15">
                <img
                  src={imagePreview}
                  alt="Carrier preview"
                  className="w-full h-56 object-cover"
                />
                <label className="absolute bottom-3 right-3 cursor-pointer bg-[#5A2E25] text-white text-xs font-mono px-4 py-2 rounded-full hover:bg-[#B5543A] transition-colors">
                  Select Different Carrier
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-[#5A2E25]/25 rounded-2xl py-10 hover:border-[#B5543A] transition-colors">
                <span className="text-2xl text-[#5A2E25]/40">↓</span>
                <span className="text-sm font-medium text-[#5A2E25]">
                  Upload Encoded Carrier Image
                </span>
                <span className="text-xs text-[#5A2E25]/50">
                  Must be the original, uncompressed PNG generated by the engine
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Decryption Password Input */}
          <div className="mb-6">
            <label className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#5A2E25]/60 mb-2">
              <span>Cryptographic Key (AES-256-GCM)</span>
              <span className="text-[#B5543A]">Required</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to unlock payload..."
              className="w-full p-4 rounded-2xl bg-[#FAF8F5]/90 border border-[#5A2E25]/20 focus:border-[#B5543A] focus:outline-none text-xs text-[#5A2E25] font-mono transition-colors"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleDecode}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-[#5A2E25] text-white font-medium py-4 rounded-2xl hover:bg-[#B5543A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Decrypting Payload...
              </>
            ) : (
              "Extract & Decrypt Payload"
            )}
          </button>

          {/* Decoded Output Box */}
          {decodedMessage && (
            <div className="mt-8 pt-6 border-t border-[#5A2E25]/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#5A2E25]">
                  Payload Extracted Successfully
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-mono text-[#B5543A] hover:underline"
                >
                  {copied ? "Copied to Clipboard!" : "Copy Payload"}
                </button>
              </div>
              <div className="bg-[#FAF8F5] border border-[#5A2E25]/15 rounded-2xl p-4 text-sm text-[#5A2E25] whitespace-pre-wrap break-words font-mono">
                {decodedMessage}
              </div>
            </div>
          )}

        </div>

        <div className="text-center mt-6">
          <Link
            href="/encode"
            className="text-xs font-mono text-[#5A2E25]/60 hover:text-[#B5543A] transition-colors"
          >
            Encode Another Message
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function Decode() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <p className="text-sm font-mono text-[#5A2E25]/60">Initializing Workspace...</p>
        </div>
      }
    >
      <DecodeContent />
    </Suspense>
  );
}
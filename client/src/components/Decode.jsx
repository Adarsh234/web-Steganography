"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { decodeMessageFromImage } from '../utils/Steganography.jsx';

function DecodeContent() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

    setError('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageData = reader.result;
        const message = await decodeMessageFromImage(imageData);

        if (!message || message.trim() === '') {
          setError("No hidden message found in this image, or it was encoded using a different method.");
          setDecodedMessage('');
        } else {
          setDecodedMessage(message);
        }
      } catch (err) {
        console.error("Decoding error:", err);
        setError(err.message || "Failed to decode message. Ensure this is a valid encoded PNG image.");
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-[#5A2E25]/15 pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E6D8]/60 border border-[#5A2E25]/10 text-[11px] font-bold uppercase tracking-widest text-[#6F7F5F] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6F7F5F]" />
              Decoder Workspace
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#5A2E25] font-display">
              Extract <span className="text-[#B5543A]">Payload</span>
            </h1>
          </div>
          <p className="text-xs text-[#5A2E25]/70 max-w-xs">
            Reconstructs binary payloads bit-by-bit from the red channel matrix until the terminal boundary is detected.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-[#F0E6D8]/30 border border-[#5A2E25]/15 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-sm">
          
          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-[#B5543A]/10 border border-[#B5543A]/30 text-[#B5543A] text-xs font-semibold flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-6 mb-8">
            <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
              Carrier Image Input
            </label>

            <label className="group relative flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-[#5A2E25]/20 hover:border-[#B5543A]/50 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-all cursor-pointer p-6 overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full h-56 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Carrier Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-[#5A2E25]/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[#FAF8F5] text-xs font-semibold">
                    Select Different Carrier
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#5A2E25]/5 flex items-center justify-center text-[#5A2E25] group-hover:scale-110 transition-transform">
                    ↓
                  </div>
                  <p className="text-xs font-bold text-[#5A2E25] uppercase tracking-wider">
                    Upload Encoded Carrier Image
                  </p>
                  <p className="text-[11px] text-[#5A2E25]/60 mt-1">
                    Must be the original, uncompressed PNG generated by the engine
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDecode}
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#5A2E25]/90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#FAF8F5] animate-ping" />
                Scanning Bitstream Delimiters...
              </>
            ) : (
              "Extract Hidden Payload"
            )}
          </button>

          {/* Decoded Output Box */}
          {decodedMessage && (
            <div className="mt-10 pt-8 border-t border-[#5A2E25]/15 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#6F7F5F]">
                  Payload Extracted Successfully
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#B5543A] hover:underline"
                >
                  {copied ? "Copied to Clipboard!" : "Copy Payload"}
                </button>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#5A2E25]/15 font-mono text-xs text-[#5A2E25] whitespace-pre-wrap break-words leading-relaxed shadow-inner">
                {decodedMessage}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href="/encode"
                  className="px-6 py-2.5 rounded-full bg-[#F0E6D8] text-[#5A2E25] text-xs font-bold uppercase tracking-wider hover:bg-[#F0E6D8]/80 transition"
                >
                  Encode Another Message
                </Link>
              </div>
            </div>
          )}

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
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
            <span className="h-2 w-2 rounded-full bg-[#6F7F5F] animate-ping" />
            Initializing Workspace...
          </div>
        </div>
      }
    >
      <DecodeContent />
    </Suspense>
  );
}
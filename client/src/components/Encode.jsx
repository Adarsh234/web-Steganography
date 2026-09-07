"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { encodeMessageInImage } from '../utils/Steganography.jsx';

function Encode() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setEncodedImage(null);
      setError('');
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEncode = () => {
    if (!image || !message.trim()) {
      setError("Please provide both a cover image and a secret payload.");
      return;
    }

    setError('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageData = reader.result;
        const result = await encodeMessageInImage(message, imageData);
        setEncodedImage(result);
      } catch (err) {
        console.error("Encoding error:", err);
        setError(err.message || "Failed to encode message into image.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-[#5A2E25]/15 pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E6D8]/60 border border-[#5A2E25]/10 text-[11px] font-bold uppercase tracking-widest text-[#6F7F5F] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6F7F5F]" />
              Encoder Workspace
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#5A2E25] font-display">
              Embed <span className="text-[#B5543A]">Payload</span>
            </h1>
          </div>
          <p className="text-xs text-[#5A2E25]/70 max-w-xs">
            Modulates the 8th bit of pixel red channels. Outputs lossless PNG format strictly within memory.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column: Image Source */}
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
                01. Cover Carrier Image
              </label>

              <label className="group relative flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-[#5A2E25]/20 hover:border-[#B5543A]/50 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-all cursor-pointer p-4 overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative w-full h-48 flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Cover Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-[#5A2E25]/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[#FAF8F5] text-xs font-semibold">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#5A2E25]/5 flex items-center justify-center text-[#5A2E25] group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <p className="text-xs font-bold text-[#5A2E25] uppercase tracking-wider">
                      Drop or browse image
                    </p>
                    <p className="text-[11px] text-[#5A2E25]/60 mt-1">
                      PNG, JPG, or WEBP cover file
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Right Column: Secret Payload */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
                  02. Secret Payload
                </label>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5A2E25]/50">
                  {message.length} characters
                </span>
              </div>

              <textarea
                rows="8"
                value={message}
                onChange={handleMessageChange}
                placeholder="Type confidential payload to conceal into RGB channel LSBs..."
                className="w-full h-full min-h-[220px] p-4 rounded-2xl bg-[#FAF8F5]/80 border border-[#5A2E25]/20 focus:border-[#B5543A] focus:outline-none text-xs text-[#5A2E25] placeholder-[#5A2E25]/40 font-mono resize-none transition-colors"
              />
            </div>

          </div>

          {/* Action Button */}
          <button
            onClick={handleEncode}
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#5A2E25]/90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#FAF8F5] animate-ping" />
                Modulating Color Channels...
              </>
            ) : (
              "Inject Payload & Generate Carrier"
            )}
          </button>

          {/* Output Card */}
          {encodedImage && (
            <div className="mt-10 pt-8 border-t border-[#5A2E25]/15 flex flex-col items-center">
              <div className="text-center mb-5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#6F7F5F]">
                  Extraction Ready
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-[#5A2E25] mt-0.5">
                  Lossless Encoded Carrier
                </h3>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#5A2E25]/15 shadow-sm mb-6 max-w-md w-full">
                <img
                  src={encodedImage}
                  alt="Encoded Carrier"
                  className="w-full max-h-72 object-contain rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={encodedImage}
                  download="stego-payload.png"
                  className="px-7 py-3 rounded-full bg-[#B5543A] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#B5543A]/90 transition shadow-sm"
                >
                  Download PNG
                </a>
                <Link
                  href="/decode"
                  className="px-6 py-3 rounded-full bg-[#FAF8F5] border border-[#5A2E25]/20 text-[#5A2E25] text-xs font-bold uppercase tracking-wider hover:bg-[#F0E6D8] transition"
                >
                  Verify in Decoder
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Encode;
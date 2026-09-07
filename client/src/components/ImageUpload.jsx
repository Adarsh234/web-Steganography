"use client";

import { API_URL } from '../utils/api';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gallery states
  const [vaultImages, setVaultImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const router = useRouter();

  // Fetch all archived images for the logged-in user
  const fetchVaultImages = useCallback(async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      setIsLoadingGallery(true);
      const res = await fetch(`${API_URL}/steganography/user-images`, {
        headers: { username },
      });
      const data = await res.json();
      if (res.ok) {
        setVaultImages(data.images || []);
      }
    } catch (err) {
      console.error("Failed to load vault images:", err);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  useEffect(() => {
    fetchVaultImages();
  }, [fetchVaultImages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setSuccess(null);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      setError('You must be logged in to upload images to the vault.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/steganography/encode`, {
        method: 'POST',
        headers: { username },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Carrier image archived to vault successfully!');
        setFile(null);
        setPreview(null);
        fetchVaultImages(); // Refresh the gallery list
      } else {
        setError(data.msg || data.message || 'Image vault upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Connection to backend storage service failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("Authentication missing. Please sign in again.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to permanently delete this carrier?");
    if (!confirmed) return;

    setDeletingId(imageId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/steganography/image/${imageId}`, {
        method: "DELETE",
        headers: { username },
      });

      const data = await res.json();

      if (res.ok) {
        setVaultImages((prev) => prev.filter((img) => img._id !== imageId));
        setSuccess("Carrier permanently removed from vault.");
      } else {
        setError(data.msg || "Failed to delete carrier image.");
      }
    } catch (err) {
      console.error("Deletion error:", err);
      setError("Connection to backend server failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25] px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="border-b border-[#5A2E25]/15 pb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E6D8]/60 border border-[#5A2E25]/10 text-[11px] font-bold uppercase tracking-widest text-[#6F7F5F] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6F7F5F]" />
              Image Vault Storage
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#5A2E25] font-display">
              Carrier <span className="text-[#B5543A]">Vault</span>
            </h1>
          </div>
          <p className="text-xs text-[#5A2E25]/70 max-w-xs">
            Archive covert carriers to your cloud drive and retrieve them instantly for payload inspection.
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-[#F0E6D8]/30 border border-[#5A2E25]/15 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-sm">
          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-[#B5543A]/10 border border-[#B5543A]/30 text-[#B5543A] text-xs font-semibold flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 rounded-2xl bg-[#6F7F5F]/15 border border-[#6F7F5F]/30 text-[#6F7F5F] text-xs font-semibold flex items-center gap-2">
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleImageUpload} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
                New Carrier Archive
              </label>

              <label className="group relative flex flex-col items-center justify-center min-h-[200px] rounded-2xl border-2 border-dashed border-[#5A2E25]/20 hover:border-[#B5543A]/50 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-all cursor-pointer p-6 overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative w-full h-48 flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Vault Carrier Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-[#5A2E25]/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[#FAF8F5] text-xs font-semibold">
                      Change Selection
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#5A2E25]/5 flex items-center justify-center text-[#5A2E25] group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <p className="text-xs font-bold text-[#5A2E25] uppercase tracking-wider">
                      Select or drop carrier image
                    </p>
                    <p className="text-[11px] text-[#5A2E25]/60 mt-1">
                      Lossless PNG or JPEG up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-4 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#5A2E25]/90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#FAF8F5] animate-ping" />
                  Storing into Vault...
                </>
              ) : (
                "Commit Image to Vault"
              )}
            </button>
          </form>
        </div>

        {/* User Vault Gallery Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#5A2E25]/10">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#5A2E25] font-display">
              Archived Carriers ({vaultImages.length})
            </h2>
            <button
              onClick={fetchVaultImages}
              className="text-xs uppercase tracking-wider font-semibold text-[#6F7F5F] hover:text-[#5A2E25] transition"
            >
              ↻ Refresh
            </button>
          </div>

          {isLoadingGallery ? (
            <div className="py-12 flex justify-center items-center gap-3 text-xs uppercase tracking-widest text-[#6F7F5F] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#6F7F5F] animate-ping" />
              Loading Vault Carriers...
            </div>
          ) : vaultImages.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[#5A2E25]/10 rounded-2xl">
              <p className="text-xs uppercase tracking-widest text-[#5A2E25]/60">
                No archived carriers stored in your vault yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vaultImages.map((img) => (
                <div
                  key={img._id}
                  className="group flex flex-col justify-between p-4 rounded-2xl bg-[#F0E6D8]/40 border border-[#5A2E25]/10 hover:border-[#B5543A]/40 transition-all shadow-sm"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 border border-[#5A2E25]/10 bg-[#FAF8F5] flex items-center justify-center">
                    <img
                      src={`${API_URL}${img.filepath}`}
                      alt={img.filename}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-mono font-bold text-[#5A2E25] truncate">
                      {img.filename}
                    </p>
                    <div className="flex justify-between text-[11px] text-[#5A2E25]/60">
                      <span>{(img.size / 1024).toFixed(1)} KB</span>
                      <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#5A2E25]/10">
                    <a
                      href={`${API_URL}${img.filepath}`}
                      download={img.filename}
                      className="flex-1 py-2 text-center rounded-full bg-[#FAF8F5] border border-[#5A2E25]/20 text-[11px] font-bold uppercase tracking-wider text-[#5A2E25] hover:bg-[#F0E6D8] transition"
                    >
                      Save
                    </a>
                    <button
                      onClick={() => {
                        router.push(`/decode?imageUrl=${encodeURIComponent(`${API_URL}${img.filepath}`)}`);
                      }}
                      className="flex-1 py-2 text-center rounded-full bg-[#B5543A] text-[11px] font-bold uppercase tracking-wider text-[#FAF8F5] hover:bg-[#B5543A]/90 transition shadow-sm"
                    >
                      Decode
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      disabled={deletingId === img._id}
                      title="Delete carrier"
                      className="px-3 py-2 rounded-full bg-[#5A2E25]/10 hover:bg-[#B5543A]/20 text-[#5A2E25] hover:text-[#B5543A] text-xs font-bold transition disabled:opacity-30"
                    >
                      {deletingId === img._id ? "..." : "✕"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImageUpload;
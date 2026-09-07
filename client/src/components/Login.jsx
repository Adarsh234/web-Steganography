"use client";

import { API_URL } from '../utils/api';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      console.log(response.data);

      if (response.status === 200) {
        localStorage.setItem("username", formData.username);
      }

      setFormData({ username: "", password: "" });
      router.push(redirectTo);
    } catch (err) {
      setError(err.response?.data?.msg || "Login Failed! Please verify your credentials.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25] px-6 py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E6D8]/60 border border-[#5A2E25]/10 text-[11px] font-bold uppercase tracking-widest text-[#6F7F5F] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6F7F5F]" />
            Identity Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#5A2E25] font-display">
            Welcome <span className="text-[#B5543A]">Back</span>
          </h1>
          <p className="text-xs text-[#5A2E25]/70 mt-1">
            Authenticate to access your carrier workspace and vaults.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#F0E6D8]/30 border border-[#5A2E25]/15 rounded-3xl p-8 backdrop-blur-sm shadow-sm">

          {error && (
            <div className="p-3.5 mb-6 rounded-2xl bg-[#B5543A]/10 border border-[#B5543A]/30 text-[#B5543A] text-xs font-semibold flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter identity handle"
                className="w-full p-3.5 rounded-2xl bg-[#FAF8F5]/90 border border-[#5A2E25]/20 focus:border-[#B5543A] focus:outline-none text-xs text-[#5A2E25] placeholder-[#5A2E25]/40 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full p-3.5 rounded-2xl bg-[#FAF8F5]/90 border border-[#5A2E25]/20 focus:border-[#B5543A] focus:outline-none text-xs text-[#5A2E25] placeholder-[#5A2E25]/40 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-bold tracking-widest uppercase hover:bg-[#5A2E25]/90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#FAF8F5] animate-ping" />
                  Verifying Session...
                </>
              ) : (
                "Authenticate"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#5A2E25]/10 text-center">
            <button
              onClick={() => router.push("/register")}
              className="text-xs text-[#5A2E25]/75 hover:text-[#B5543A] font-medium transition-colors"
            >
              Don't have an account? <span className="font-bold underline">Register here</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
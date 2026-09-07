"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25]">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative px-6 pt-12 pb-16 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Massive Display Title (zero~space style) */}
        <div className="w-full text-center border-b border-[#5A2E25]/15 pb-8 mb-8">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase text-[#5A2E25] font-display select-none">
            zero<span className="text-[#B5543A]">~</span>trace
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm font-medium tracking-wide text-[#5A2E25]/80 mt-4 px-2">
            <p>Conceal, encrypt, and extract payloads in pixel matrices</p>
            <p className="mt-2 sm:mt-0 text-[#6F7F5F]">Zero visual degradation — lossless canvas pipeline</p>
          </div>
        </div>

        {/* Floating Quick-Action Pill Bar */}
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-[#5A2E25]/15 rounded-full p-2 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-16">
          <div className="flex items-center gap-2 pl-4 text-xs font-semibold uppercase tracking-wider text-[#5A2E25]/70">
            <span className="h-2 w-2 rounded-full bg-[#6F7F5F] animate-pulse" />
            Algorithm: LSB 8-Bit
          </div>
          
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#5A2E25]/60">
            <span>Red Channel</span>
            <span>•</span>
            <span>Client Rendered</span>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <Link
              href="/encode"
              className="px-6 py-2.5 rounded-full bg-[#B5543A] text-[#FAF8F5] text-xs font-semibold tracking-wide hover:bg-[#B5543A]/90 transition shadow-sm"
            >
              Encode now
            </Link>
            <Link
              href="/decode"
              className="px-5 py-2.5 rounded-full bg-[#F0E6D8] text-[#5A2E25] text-xs font-semibold tracking-wide hover:bg-[#F0E6D8]/80 transition"
            >
              Decode
            </Link>
          </div>
        </div>

        {/* 2. SPLIT PHILOSOPHY STATEMENT */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-8 border-b border-[#5A2E25]/15 mb-14">
          <div className="md:col-span-4 text-xs uppercase tracking-widest text-[#6F7F5F] font-bold">
            Security at Pixel Depth
          </div>
          <div className="md:col-span-8 text-xl sm:text-2xl md:text-3xl font-light leading-snug text-[#5A2E25]">
            From ephemeral secret messages to permanent covert payload injection — we 
            render invisible data layers directly into image color matrices with zero cloud reliance.
          </div>
        </div>

        {/* 3. THREE-COLUMN CARDS (Focus Room / Café / Creator Style) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1 */}
          <div className="group flex flex-col justify-between p-6 rounded-2xl bg-[#F0E6D8]/50 border border-[#5A2E25]/10 hover:border-[#B5543A]/40 transition-all duration-300">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#B5543A]/15 text-[#B5543A] flex items-center justify-center font-bold text-sm mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-[#5A2E25] mb-2">LSB Red Matrix</h3>
              <p className="text-sm text-[#5A2E25]/75 leading-relaxed">
                Replaces the least significant bit of 8-bit color channels without alerting visual or histogram sniffers.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#6F7F5F] mt-6">
              Covert Storage
            </span>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col justify-between p-6 rounded-2xl bg-[#F0E6D8]/50 border border-[#5A2E25]/10 hover:border-[#B5543A]/40 transition-all duration-300">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#6F7F5F]/20 text-[#6F7F5F] flex items-center justify-center font-bold text-sm mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-[#5A2E25] mb-2">Null Leak Protocol</h3>
              <p className="text-sm text-[#5A2E25]/75 leading-relaxed">
                Images are converted to byte buffers inside local HTML5 canvas threads. Never transmitted across the wire.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#6F7F5F] mt-6">
              100% In-Memory
            </span>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col justify-between p-6 rounded-2xl bg-[#F0E6D8]/50 border border-[#5A2E25]/10 hover:border-[#B5543A]/40 transition-all duration-300">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#5A2E25]/10 text-[#5A2E25] flex items-center justify-center font-bold text-sm mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-[#5A2E25] mb-2">Stream Terminus</h3>
              <p className="text-sm text-[#5A2E25]/75 leading-relaxed">
                Uses instant delimiter triggers to halt pixel traversal on the first match, speeding up decoding times.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#6F7F5F] mt-6">
              Instant Extraction
            </span>
          </div>
        </div>

        {/* Action Link */}
        <div className="flex justify-center mb-20">
          <Link
            href="/upload-image"
            className="px-8 py-3 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase hover:bg-[#5A2E25]/90 transition"
          >
            Explore Image Vault
          </Link>
        </div>

        {/* 4. EDITORIAL METRIC STATS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-[#5A2E25]/15 mb-20">
          <div>
            <div className="text-4xl md:text-5xl font-black text-[#5A2E25] font-display">
              8 <span className="text-[#B5543A] text-2xl font-sans">Bits/Byte</span>
            </div>
            <p className="text-xs uppercase font-semibold text-[#6F7F5F] mt-2">Bit Density Modulator</p>
            <p className="text-xs text-[#5A2E25]/70 mt-1">Maximum payload capacity with minimum pixel variation.</p>
          </div>

          <div>
            <div className="text-4xl md:text-5xl font-black text-[#5A2E25] font-display">
              0.00 <span className="text-[#B5543A] text-2xl font-sans">%</span>
            </div>
            <p className="text-xs uppercase font-semibold text-[#6F7F5F] mt-2">Color Distortion</p>
            <p className="text-xs text-[#5A2E25]/70 mt-1">Maintains clean color gradients and sharpness under standard analysis.</p>
          </div>

          <div>
            <div className="text-4xl md:text-5xl font-black text-[#5A2E25] font-display">
              100 <span className="text-[#B5543A] text-2xl font-sans">%</span>
            </div>
            <p className="text-xs uppercase font-semibold text-[#6F7F5F] mt-2">Client Isolated</p>
            <p className="text-xs text-[#5A2E25]/70 mt-1">All encryption and decryption happens exclusively on your machine.</p>
          </div>
        </div>

      </section>

      {/* 5. DEEP RUST DARK CONTRAST SECTION (Bottom Feature Block) */}
      <section className="bg-[#5A2E25] text-[#FAF8F5] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#F0E6D8]/60 font-semibold">
              Engine Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#FAF8F5]">
              Everything you need to encode, disguise, and unpack — in one interface
            </h2>
            <p className="text-sm text-[#F0E6D8]/80 leading-relaxed">
              Designed for privacy-focused engineers and security researchers. Encapsulate 
              critical text strings into cover images without third-party dependencies.
            </p>
            <div>
              <Link
                href="/encode"
                className="inline-block px-7 py-3 rounded-full bg-[#FAF8F5] text-[#5A2E25] text-xs font-bold tracking-wider uppercase hover:bg-[#F0E6D8] transition"
              >
                Launch Encoder
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 backdrop-blur-sm flex items-start gap-4">
              <span className="text-[#B5543A] font-bold text-sm">01</span>
              <div>
                <h4 className="text-sm font-semibold text-[#FAF8F5]">Lossless Canvas Rasterization</h4>
                <p className="text-xs text-[#F0E6D8]/70 mt-1">Enforces PNG serialization to guarantee zero pixel compression.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 backdrop-blur-sm flex items-start gap-4">
              <span className="text-[#6F7F5F] font-bold text-sm">02</span>
              <div>
                <h4 className="text-sm font-semibold text-[#FAF8F5]">Terminal Flag Parsing</h4>
                <p className="text-xs text-[#F0E6D8]/70 mt-1">Dynamic byte inspection halts decoding as soon as the terminal sequence is recognized.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 backdrop-blur-sm flex items-start gap-4">
              <span className="text-[#F0E6D8] font-bold text-sm">03</span>
              <div>
                <h4 className="text-sm font-semibold text-[#FAF8F5]">Dual-Pane Execution</h4>
                <p className="text-xs text-[#F0E6D8]/70 mt-1">Integrated Encode and Decode workflows accessible from a single dashboard.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
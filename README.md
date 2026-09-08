# zero~trace

> Covert visual cryptography & client-side LSB steganography platform with persistent carrier vaults.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-B5543A?style=flat-square)](LICENSE)

---

## Overview

**zero~trace** is a full-stack steganographic workspace designed with a warm, editorial "zero~space" aesthetic. It enables secure, zero-knowledge payload injection into lossless image carriers entirely in the browser using HTML5 Canvas pixel manipulation, coupled with a Node.js/Express backend for authenticated carrier vault archiving.

Plaintext messages never touch the wire unencoded. Bitstreams are woven directly into the least significant bits of image channel arrays client-side before any optional cloud persistence occurs.

---

## Core Features

- **Zero-Knowledge Client-Side LSB:** Payload encoding and bitstream extraction run locally via the HTML5 Canvas API. Unencoded secrets never transmit across the network.
- **Null-Delimiter Bitstream Framing:** Messages are encoded with an explicit terminal sequence (`00000000`) across color channels, preventing read-overflow and artifact corruption.
- **Carrier Image Vault:** Authenticated users can store, preview, download, and manage steganographic carriers directly in a cloud archive.
- **Direct Workspace Hand-off:** Vault carriers can be dispatched directly to the decoder workspace via query parameters with automatic cross-origin blob resolution.
- **Secure Route Interception:** Unauthenticated visitors can view the platform showcase; operational workspaces (`/encode`, `/decode`, `/upload-image`) are guarded behind session verification with preserved return redirects.
- **Editorial Aesthetic:** Custom 60:30:10 palette (`#FAF8F5`, `#F0E6D8`, `#5A2E25`, `#B5543A`, `#6F7F5F`) paired with minimal pill-based geometry and monospace telemetry.

---

## System Architecture


```

┌────────────────────────────────────────────────────────┐
│                   Browser / Client                     │
│  ┌──────────────────┐           ┌───────────────────┐  │
│  │   Encode View    │           │    Decode View    │  │
│  │ (Canvas LSB Wite)│           │(Canvas LSB Read)  │  │
│  └────────┬─────────┘           └─────────▲─────────┘  │
│           │                               │            │
│           │ Blob                          │ Image URL  │
│           ▼                               │            │
│  ┌────────────────────────────────────────┴─────────┐  │
│  │               Vault Gallery & Upload             │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
│ HTTP Multipart / JSON
│ Headers: { username }
┌───────────────────────────▼────────────────────────────┐
│                  Express.js Backend                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ /auth               • Login & Identity Creation  │  │
│  │ /steganography      • Multer Storage & Disk I/O  │  │
│  │ /uploads            • Static Carrier Assets      │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
│ Mongoose ODM
┌───────────────────────────▼────────────────────────────┐
│                    MongoDB Atlas                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Users Collection   │   Images (Vault Metadata)  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘

```

---

## Technical Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Axios |
| **Cryptography** | HTML5 Canvas 2D Context, Least Significant Bit (LSB) Modulation |
| **Backend** | Node.js, Express.js, Multer (Disk Storage), CORS |
| **Database** | MongoDB Atlas via Mongoose 8+ |
| **Deployment** | Vercel (Client), Render / Railway (Backend Server) |

---

## Steganography Engine Details

The platform uses Least Significant Bit (LSB) modulation over 8-bit RGBA pixel byte arrays:

1. **Text to Binary Conversion:** Each UTF-8 character is converted to an 8-bit binary representation.
2. **Sentinel Boundary:** A null-byte terminator sequence (`1111111111111110` / `00000000`) is appended to mark EOF.
3. **Channel Injection:** The least significant bit of each pixel's red channel is replaced with a payload bit:
   $$\text{Channel}' = (\text{Channel} \ \& \ \sim 1) \ | \ \text{Bit}$$
4. **Extraction:** During decoding, bits are read sequentially from the red channel until the sentinel pattern matches, reconstructing the plaintext message without transmitting image data to third-party endpoints.

> **Note:** Only uncompressed or losslessly compressed carriers (such as PNG) preserve injected bitstreams. Lossy compression formats (like standard JPEG) discard high-frequency LSB values.

---

## Getting Started

### Prerequisites

- Node.js `20.x` or later
- npm or pnpm
- MongoDB Atlas cluster URI (or local MongoDB daemon)

### 1. Repository Setup

```bash
git clone [https://github.com/Adarsh234/web-Steganography.git](https://github.com/Adarsh234/web-Steganography.git)
cd web-Steganography

```

### 2. Backend Configuration

```bash
cd backend # or your server directory
npm install

```

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/steganography?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000,[https://web-steganography.vercel.app](https://web-steganography.vercel.app)

```

Start the API service:

```bash
npm run dev
# Server listening on http://localhost:5000

```

### 3. Frontend Configuration

```bash
cd ../client
npm install

```

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

```

Launch the Next.js development server:

```bash
npm run dev
# Next.js running on http://localhost:3000

```

---

## API Reference

### Authentication

* `POST /auth/register` — Registers an identity handle and credentials.
* `POST /auth/login` — Authenticates session and sets client token state.

### Carrier Vault

* `POST /steganography/encode` — Uploads an encoded carrier image to user vault storage. Requires `username` header.
* `GET /steganography/user-images` — Fetches metadata for all images owned by the requesting user. Requires `username` header.
* `DELETE /steganography/image/:id` — Removes an image record from MongoDB and unlinks the file from disk. Requires `username` header.

---

## License

Distributed under the MIT License. See `LICENSE` for details.

<FollowUp label="Want to add deployment documentation for hosting the Node.js backend on Render or Railway?" query="Provide a step-by-step guide to deploy the Express backend to Render with persistent disk storage and environment variables."/>

# zero~trace

> Covert visual steganography & client-side LSB payload injection platform with persistent carrier vaults.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Live-000000?style=flat-square&logo=vercel)](https://web-steganography.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-B5543A?style=flat-square)](LICENSE)

---

## Overview

**zero~trace** is a full-stack steganographic workspace built with an editorial "zero~space" design language. It allows users to embed encrypted or plain text payloads directly into lossless carrier images entirely inside the browser using HTML5 Canvas pixel manipulation. 

Because encoding and decoding happen on the client machine, unencoded sensitive text never traverses the network. The accompanying Express/MongoDB backend serves exclusively as an authenticated carrier vault for cloud archiving, retrieval, and hand-off.

Live Demo: [web-steganography.vercel.app](https://web-steganography.vercel.app)

---

## Core Features

- **Zero-Knowledge Client Execution:** Payload injection and extraction occur locally in the browser's 2D canvas context. No raw message data is ever sent to the server.
- **Sentinel-Delimited Bitstreams:** Encodes messages with an explicit null-terminator sequence (`00000000`) across color channels, preventing buffer over-reads and image corruption during extraction.
- **Persistent Carrier Vault:** Authenticated users can archive carrier images, inspect file sizes, preview stored media, and manage records via cloud storage.
- **Seamless Workspace Hand-Off:** Jump straight from the Vault Gallery into the Decoder workspace via URL queries with automated cross-origin blob fetching.
- **Route Guard Interceptors:** Workspace routes (`/encode`, `/decode`, `/upload-image`) are guarded behind authentication checkpoints that preserve intent with redirect queries.
- **Editorial UI System:** Warm 60:30:10 chromatic hierarchy (`#FAF8F5`, `#F0E6D8`, `#5A2E25`, `#B5543A`, `#6F7F5F`) with minimal pill geometry, reactive loading feedback, and monospaced diagnostic readouts.

---

## Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Browser / Client                     │
│  ┌──────────────────┐           ┌───────────────────┐  │
│  │   Encode View    │           │    Decode View    │  │
│  │(Canvas LSB Write)│           │ (Canvas LSB Read) │  │
│  └────────┬─────────┘           └─────────▲─────────┘  │
│           │                               │            │
│           │ Blob (Carrier)                │ Image URL  │
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
│  │ /auth               • Login & Account Creation   │  │
│  │ /steganography      • Multer Storage & Disk I/O  │  │
│  │ /uploads            • Static Carrier Hosting     │  │
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

## Repository Structure

```text
web-steganography/
├── client/                     # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                # Page entry points (layout, page, login, decode, etc.)
│   │   ├── components/         # Core UI (Navbar, Footer, ImageUpload, ClientWrapper)
│   │   ├── context/            # AuthContext & state hooks
│   │   └── utils/              # Canvas LSB algorithms & API config
│   ├── .env.local              # Local environment variables (git-ignored)
│   └── package.json
│
├── server/                     # Node.js Express REST Backend
│   ├── models/                 # Mongoose schemas (User, Image)
│   ├── routes/                 # Express routers (/auth, /steganography)
│   ├── uploads/                # Local/persistent carrier storage (git-ignored)
│   ├── .env                    # Secrets & connection strings (git-ignored)
│   ├── server.js               # Server entry point & CORS configuration
│   └── package.json
│
└── README.md

```

---

## How the Steganography Engine Works

The client-side engine executes Least Significant Bit (LSB) modulation on the red component of the 8-bit RGBA pixel matrix:

1. **Bitstream Translation:** UTF-8 input strings are unpacked into sequential 8-bit binary arrays.
2. **Sentinel Injection:** An end-of-payload null byte (`00000000`) is appended to mark the bitstream termination boundary.
3. **Pixel Modulation:** The least significant bit of each pixel's red channel is replaced:

$$\text{Channel}' = (\text{Channel} \ \& \ \sim 1) \ | \ \text{Bit}$$


4. **Extraction:** The decoding worker samples the red channel bits sequentially until the terminal delimiter is parsed, rebuilding the original string.

> **Important:** Always export encoded images as lossless **PNG**. Lossy compression algorithms (like standard JPEG) resample color values across pixel blocks, irreversibly destroying LSB payload bits.

---

## Local Development Setup

### Prerequisites

* Node.js 20.x or 24.x
* npm or pnpm
* A running MongoDB instance (local or MongoDB Atlas)

### 1. Clone Repository

```bash
git clone [https://github.com/Adarsh234/web-Steganography.git](https://github.com/Adarsh234/web-Steganography.git)
cd web-Steganography

```

### 2. Configure & Start Backend

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/steganography?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000,[http://127.0.0.1:3000](http://127.0.0.1:3000)

```

Start the API service:

```bash
npm run dev
# Server listening on http://localhost:5000

```

### 3. Configure & Start Frontend

```bash
cd ../client
npm install

```

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

```

Start the Next.js development server:

```bash
npm run dev
# Client running on http://localhost:3000

```

---

## Production Deployment

### Frontend (Vercel)

1. Import your GitHub repository on **Vercel**.
2. Set **Root Directory** to `client`.
3. Framework Preset will automatically detect **Next.js**.
4. Configure Environment Variables:
* `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://zero-trace-api.onrender.com`).


5. Deploy.

### Backend (Render / Railway)

1. Create a new **Web Service** pointing to the repository root.
2. Set the **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. Add Environment Variables:
* `PORT`: `5000`
* `MONGO_URI`: Your MongoDB Atlas connection URI.
* `CLIENT_URL`: `https://web-steganography.vercel.app`


6. *(Optional for Render)*: Add a **Persistent Disk** mounted at `/uploads` if you want archived carriers to survive container restarts on the free/standard tiers.

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new username and password |
| `POST` | `/auth/login` | Validate credentials and establish session |

### Vault & Carrier Endpoints

| Method | Endpoint | Required Headers | Description |
| --- | --- | --- | --- |
| `POST` | `/steganography/encode` | `username: <string>` | Save an encoded carrier file to vault storage |
| `GET` | `/steganography/user-images` | `username: <string>` | Fetch all archived carriers belonging to user |
| `DELETE` | `/steganography/image/:id` | `username: <string>` | Delete carrier record from database and disk |

---

## License

Distributed under the MIT License. See [LICENSE](https://www.google.com/search?q=LICENSE) for details.

```

```
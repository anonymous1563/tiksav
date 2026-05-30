# TikSave — TikTok Video Downloader

Download TikTok videos in the highest quality, no watermark, free.

## Requirements
- [Node.js](https://nodejs.org/) v16 or higher

## Setup & Run

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Start the server
npm start
```

Then open your browser at: **http://localhost:3000**

## How it works

```
Browser → localhost:3000/api/video → tikwm.com API → returns download links
Browser → localhost:3000/api/stream → pipes the MP4/MP3 directly to your device
```

The Node.js server acts as a proxy — it calls the TikTok API on your behalf
(bypassing the CORS restriction that blocked the browser-only version).

## Download quality options

| Option        | Quality      | Watermark |
|---------------|-------------|-----------|
| HD Video      | Highest (HD) | None ✅   |
| Standard Video| Normal       | None ✅   |
| With Watermark| Original     | Yes       |
| Audio Only    | MP3          | —         |

## Folder structure

```
tiksave/
├── server.js        ← Express backend + proxy
├── package.json
└── public/
    └── index.html   ← Frontend UI
```

## Notes

- Only works with **public** TikTok videos
- Not affiliated with TikTok or ByteDance Ltd.
- For personal use only

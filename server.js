const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint — avoids CORS by calling tikwm from server side
app.get('/api/video', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const isTikTok = url.includes('tiktok.com') || url.includes('douyin.com') || url.includes('vm.tiktok');
  if (!isTikTok) {
    return res.status(400).json({ error: 'Not a valid TikTok URL' });
  }

  try {
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Upstream API error: ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to reach video API. ' + err.message });
  }
});

// Proxy video stream — lets browser download directly without CORS issues on the file
app.get('/api/stream', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  try {
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/',
      },
    });

    if (!response.ok) return res.status(502).send('Upstream error');

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="tiksave_video.mp4"`);
    if (contentLength) res.setHeader('Content-Length', contentLength);

    response.body.pipe(res);
  } catch (err) {
    console.error('Stream error:', err.message);
    res.status(500).send('Stream failed');
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ TikSave running at http://localhost:${PORT}\n`);
});

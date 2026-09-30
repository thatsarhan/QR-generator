import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'links.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial sample links if none exist
if (!fs.existsSync(DATA_FILE)) {
  const initialLinks = [
    {
      id: '1',
      slug: 'brochure',
      title: '2026 Summer Collection SharePoint PDF',
      destinationUrl: 'https://rivelabs-my.sharepoint.com/:b:/g/personal/arhan_rive_ai/EQvSampleSharePointDocument',
      scanCount: 14,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialLinks, null, 2));
}

// API: Get all short links
app.get('/api/links', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json([]);
  }
});

// API: Create short link
app.post('/api/links', (req, res) => {
  try {
    const { title, slug, destinationUrl } = req.body;
    const links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    const cleanSlug = (slug || Math.random().toString(36).substring(2, 8))
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');

    // Check unique slug
    if (links.some((l: any) => l.slug === cleanSlug)) {
      return res.status(400).json({ error: 'Slug must be unique. This slug is already taken.' });
    }

    const newLink = {
      id: Math.random().toString(36).substring(2, 9),
      slug: cleanSlug,
      title: title || 'Untitled SharePoint Link',
      destinationUrl,
      scanCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    links.unshift(newLink);
    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
    res.json(newLink);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create short link' });
  }
});

// API: Update short link destination
app.put('/api/links/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, destinationUrl } = req.body;
    const links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const link = links.find((l: any) => l.id === id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (title) link.title = title;
    if (destinationUrl) link.destinationUrl = destinationUrl;
    link.updatedAt = Date.now();

    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update short link' });
  }
});

// API: Delete short link
app.delete('/api/links/:id', (req, res) => {
  try {
    const { id } = req.params;
    let links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    links = links.filter((l: any) => l.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete short link' });
  }
});

// REDIRECT ROUTE: /pdf (Direct PDF redirect)
app.get('/pdf', (req, res) => {
  res.redirect(302, 'https://rivelabs-my.sharepoint.com/:b:/g/personal/arhan_rive_ai/EQvSampleSharePointDocument');
});

// REDIRECT ROUTE: /r/:slug (HTTP 302 redirect to destinationUrl with scan counter increment)
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  try {
    const links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const link = links.find((l: any) => l.slug === slug);

    if (link) {
      link.scanCount = (link.scanCount || 0) + 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));

      // HTTP 302 redirect to destinationUrl (e.g. SharePoint)
      res.redirect(302, link.destinationUrl);
    } else {
      res.status(404).send(`<!DOCTYPE html>
      <html>
      <head>
        <title>Link Not Found — Rive QR Studio</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Syne:wght@700&display=swap" rel="stylesheet">
      </head>
      <body style="font-family:'Plus Jakarta Sans',sans-serif; background:#FFF9F6; color:#0E3415; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
        <div style="background:white; padding:40px; border-radius:24px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05); max-width:400px; border:1px solid #e5e7eb;">
          <h2 style="font-family:'Syne',sans-serif; margin-top:0; color:#0E3415;">Link Not Found</h2>
          <p style="color:#6b7280; font-size:14px;">The short link <strong>go.rive.ai/r/${slug}</strong> does not exist or has been removed.</p>
          <a href="/" style="display:inline-block; background:#0E3415; color:white; padding:12px 24px; border-radius:99px; text-decoration:none; font-weight:600; font-size:14px; margin-top:16px;">Create Rive QR Code</a>
        </div>
      </body>
      </html>`);
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// Vite integration in dev
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Rive QR Studio server running on port ${PORT}`);
});

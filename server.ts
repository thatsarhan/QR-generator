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
      slug: 'catalog-2026',
      title: '2026 Summer Collection PDF',
      destinationUrl: 'https://mycompany-my.sharepoint.com/:b:/g/personal/arhan_rive_ai/EQvSampleSharePointDocument',
      clicks: 14,
      createdAt: Date.now(),
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

    const newLink = {
      id: Math.random().toString(36).substring(2, 9),
      slug: slug || Math.random().toString(36).substring(2, 8),
      title: title || 'Untitled Document',
      destinationUrl,
      clicks: 0,
      createdAt: Date.now(),
    };

    links.unshift(newLink);
    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
    res.json(newLink);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create short link' });
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

// REDIRECT ROUTE: /r/:slug (Masks SharePoint with clean domain)
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  try {
    const links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const link = links.find((l: any) => l.slug === slug);

    if (link) {
      // Increment clicks
      link.clicks = (link.clicks || 0) + 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));

      // Return a gorgeous Daely/Rive branded redirect splash page that instantly forwards to SharePoint
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirecting to ${link.title} — Rive AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #FFF9F6;
            color: #2F2F35;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            padding: 40px;
            border-radius: 32px;
            max-width: 480px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          }
          .logo {
            width: 56px;
            height: 56px;
            border-radius: 20px;
            background: linear-gradient(135deg, #F7A8C9, #8ED8FF);
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Syne', sans-serif;
            font-weight: 800;
            font-size: 20px;
            color: #2F2F35;
          }
          h1 {
            font-family: 'Syne', sans-serif;
            font-size: 24px;
            margin: 0 0 12px;
            color: #2F2F35;
          }
          p {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 24px;
          }
          .btn {
            display: inline-block;
            background: #2F2F35;
            color: white;
            padding: 14px 28px;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .btn:hover { background: #1f1f23; }
        </style>
        <meta http-equiv="refresh" content="0.8;url=${link.destinationUrl}">
      </head>
      <body>
        <div class="card">
          <div class="logo">R</div>
          <h1>Opening ${link.title}</h1>
          <p>Redirecting securely from <strong>rive.ai</strong> to SharePoint document...</p>
          <a href="${link.destinationUrl}" class="btn">Click here if not redirected</a>
        </div>
      </body>
      </html>`);
    } else {
      res.status(404).send(`<!DOCTYPE html>
      <html>
      <head><title>Link Not Found</title></head>
      <body style="font-family:sans-serif; text-align:center; padding:50px;">
        <h2>Short link not found</h2>
        <p>The requested branded short link does not exist or has expired.</p>
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
  console.log(`Server running on port ${PORT}`);
});

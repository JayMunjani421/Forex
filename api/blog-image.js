export default async function handler(req, res) {
  const raw = req.query.url;
  if (!raw || typeof raw !== 'string') {
    return res.status(400).json({ error: 'Missing url' });
  }

  let target;
  try {
    target = new URL(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    return res.status(400).json({ error: 'Invalid protocol' });
  }

  try {
    const upstream = await fetch(target.href, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/*,*/*',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).end();
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(buffer);
  } catch {
    return res.status(502).end();
  }
}

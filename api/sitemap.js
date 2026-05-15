import { getBlogPosts } from './blogFeed.mjs';

const STATIC_PATHS = ['/', '/blog', '/calculators', '/charts', '/news', '/market-today', '/learn', '/glossary', '/market-hours', '/about'];

export default async function handler(req, res) {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${proto}://${host}`;

    const posts = await getBlogPosts();
    const staticUrls = STATIC_PATHS.map(
      (path) => `<url><loc>${origin}${path}</loc><changefreq>weekly</changefreq><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`,
    ).join('');

    const blogUrls = posts
      .slice(0, 60)
      .map(
        (p) =>
          `<url><loc>${origin}/blog/${encodeURIComponent(p.slug)}</loc><lastmod>${p.publishedAt.split('T')[0]}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`,
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send('Sitemap error');
  }
}

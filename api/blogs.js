import { getBlogPosts, pickDailyPosts } from './blogFeed.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slug = typeof req.query.slug === 'string' ? req.query.slug : undefined;
    const posts = await getBlogPosts({ slug, full: Boolean(slug) });

    if (slug) {
      if (!posts) return res.status(404).json({ error: 'Post not found' });
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json({ post: posts });
    }

    const all = posts;
    const daily = pickDailyPosts(all, 5);
    const dailySlugs = new Set(daily.map((p) => p.slug));
    const archive = all.filter((p) => !dailySlugs.has(p.slug)).slice(0, 40);

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      daily,
      posts: [...daily, ...archive],
    });
  } catch (err) {
    console.error('blogs api error', err);
    return res.status(502).json({
      error: 'Could not load blogs',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

import { getBlogPosts, pickDailyPosts } from './api/blogFeed.mjs';

export function blogApiDevPlugin() {
  return {
    name: 'blog-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/blog-image')) {
          try {
            const url = new URL(req.url, 'http://localhost');
            const imageUrl = url.searchParams.get('url');
            if (!imageUrl) {
              res.statusCode = 400;
              res.end('Missing url');
              return;
            }
            const upstream = await fetch(imageUrl, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'image/*,*/*',
              },
            });
            if (!upstream.ok) {
              res.statusCode = upstream.status;
              res.end();
              return;
            }
            const buffer = Buffer.from(await upstream.arrayBuffer());
            res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
            res.end(buffer);
          } catch {
            res.statusCode = 502;
            res.end();
          }
          return;
        }

        if (!req.url?.startsWith('/api/blogs')) return next();

        try {
          const url = new URL(req.url, 'http://localhost');
          const slug = url.searchParams.get('slug') || undefined;
          const posts = await getBlogPosts({ slug, full: Boolean(slug) });

          res.setHeader('Content-Type', 'application/json');

          if (slug) {
            if (!posts) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Post not found' }));
              return;
            }
            res.end(JSON.stringify({ post: posts }));
            return;
          }

          const daily = pickDailyPosts(posts, 5);
          const dailySlugs = new Set(daily.map((p) => p.slug));
          const archive = posts.filter((p) => !dailySlugs.has(p.slug)).slice(0, 40);

          res.end(
            JSON.stringify({
              updatedAt: new Date().toISOString(),
              daily,
              posts: [...daily, ...archive],
            }),
          );
        } catch (err) {
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              error: 'Could not load blogs',
              message: err instanceof Error ? err.message : 'Unknown error',
            }),
          );
        }
      });
    },
  };
}

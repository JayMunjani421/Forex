import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import BlogCard from '../components/blog/BlogCard';
import { fetchBlogList } from '../api/blogsClient';
import { usePageMeta } from '../hooks/usePageMeta';

export default function BlogListPage() {
  const [daily, setDaily] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  usePageMeta({
    title: 'Forex & Trading Blog',
    description:
      'Daily forex and trading recaps from trusted publishers — original summaries, images, and links to full stories. Updated automatically.',
    canonicalPath: '/blog',
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Forex Tools Blog',
      description: 'Daily forex market recaps and educational summaries.',
      url: typeof window !== 'undefined' ? `${window.location.origin}/blog` : '/blog',
    },
  });

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBlogList();
      setDaily(data.daily || []);
      setPosts(data.posts || []);
      setUpdatedAt(data.updatedAt || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load blogs.');
      setDaily([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const archive = posts.filter((p) => !daily.some((d) => d.slug === p.slug));

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-10">
        <section className="text-center">
          <PageHeading>Forex &amp; trading blog</PageHeading>
          <p className="mt-3 text-lg font-light leading-relaxed text-indigo-100/70">
            Fresh market stories every day — pulled from trusted forex publishers, rewritten as short educational
            recaps with images and links to the original articles.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span>3–5 new picks daily</span>
            {updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span>Last sync {new Date(updatedAt).toLocaleString()}</span>
              </>
            )}
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-slate-400 hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden />
              Refresh
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-amber-500/25 bg-amber-950/25 p-4 text-sm text-amber-100/90">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-500">Loading latest articles…</p>
        ) : (
          <>
            {daily.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Today&apos;s picks</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  {daily.map((post, i) => (
                    <BlogCard key={post.slug} post={post} featured={i === 0} />
                  ))}
                </div>
              </section>
            )}

            {archive.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">More articles</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {archive.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {!daily.length && !archive.length && (
              <p className="text-center text-slate-500">No articles available right now. Try again shortly.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

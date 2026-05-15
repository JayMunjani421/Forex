import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchBlogPost } from '../api/blogsClient';
import { usePageMeta } from '../hooks/usePageMeta';
import { blogImageSrc } from '../utils/blogImage';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPost(slug);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load article.');
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const imageSrc = blogImageSrc(post?.image);

  usePageMeta({
    title: post?.title || 'Article',
    description: post?.excerpt,
    image: imageSrc || post?.image,
    canonicalPath: post ? `/blog/${post.slug}` : undefined,
    type: 'article',
    publishedTime: post?.publishedAt,
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: imageSrc || post.image,
          datePublished: post.publishedAt,
          author: { '@type': 'Organization', name: 'Forex Tools' },
          publisher: { '@type': 'Organization', name: 'Forex Tools' },
        }
      : undefined,
  });

  if (loading) {
    return (
      <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-12">
        <p className="text-slate-500">Loading article…</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="max-w-lg text-center">
          <p className="text-rose-300">{error || 'Article not found.'}</p>
          <Link to="/blog" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
            ← Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const dateLabel = format(parseISO(post.publishedAt), 'MMMM d, yyyy');
  const paragraphs = post.bodyParagraphs?.length ? post.bodyParagraphs : post.paragraphs || [];

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <article className="w-full max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All articles
        </Link>

        <header className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <time dateTime={post.publishedAt}>{dateLabel}</time>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">{post.title}</h1>
          {imageSrc && (
            <img
              src={imageSrc}
              alt=""
              className="w-full rounded-2xl border border-white/10 object-cover max-h-105"
              loading="eager"
            />
          )}
        </header>

        <p className="mt-6 text-sm leading-relaxed text-indigo-100/80">{post.intro}</p>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="mt-10 text-xs leading-relaxed text-slate-500">{post.disclaimer}</p>
      </article>
    </main>
  );
}

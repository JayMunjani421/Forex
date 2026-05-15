import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { blogImageSrc } from '../../utils/blogImage';

export default function BlogCard({ post, featured = false }) {
  const dateLabel = format(parseISO(post.publishedAt), 'MMM d, yyyy');
  const imageSrc = blogImageSrc(post.image);

  return (
    <article
      className={`group overflow-hidden rounded-3xl border border-white/5 bg-[#0d1323]/70 backdrop-blur-xl transition hover:border-indigo-400/30 ${
        featured ? 'md:grid md:grid-cols-2' : ''
      }`}
    >
      <div className={`relative ${featured ? 'min-h-48 md:min-h-full' : 'h-44'} bg-[#0a0f1a]`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-indigo-400/40">
            <Newspaper className="h-12 w-12" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-col p-5 md:p-6">
        <time className="text-xs font-medium text-slate-500" dateTime={post.publishedAt}>
          {dateLabel}
        </time>
        <h2 className="mt-2 text-lg font-bold leading-snug text-white md:text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:text-indigo-300">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Read article
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

import { format, parseISO } from 'date-fns';
import { Newspaper } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { blogPosts } from '../data/blogPosts';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function BlogPage() {
  useDocumentTitle('Forex Tools — Week in FX');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center">
          <PageHeading>Week in FX</PageHeading>
          <p className="mt-3 text-lg font-light leading-relaxed text-indigo-100/70">
            Short editorial-style notes on sessions, risk, and mechanics — static posts you can replace with your own
            weekly write-ups or a CMS later.
          </p>
        </div>

        <div className="space-y-12">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              id={post.slug}
              className="scroll-mt-28 rounded-3xl border border-white/5 bg-[#0d1323]/60 p-8 shadow-xl backdrop-blur-xl lg:scroll-mt-32"
            >
              <header className="border-b border-white/10 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Week in FX</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{post.title}</h2>
                <time className="mt-2 block text-sm text-slate-500" dateTime={post.dateISO}>
                  {format(parseISO(post.dateISO), 'MMMM d, yyyy')}
                </time>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
              </header>
              <div className="mt-6 max-w-none space-y-4 text-sm leading-relaxed text-slate-300">
                {post.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

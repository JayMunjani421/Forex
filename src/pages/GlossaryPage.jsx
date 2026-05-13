import { useMemo, useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { glossaryTerms, glossaryCategories } from '../data/glossary';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function GlossaryPage() {
  useDocumentTitle('Forex Tools — Glossary');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return glossaryTerms.filter((t) => {
      const okCat = cat === 'All' || t.category === cat;
      if (!okCat) return false;
      if (!needle) return true;
      return (
        t.term.toLowerCase().includes(needle) ||
        t.definition.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle)
      );
    });
  }, [q, cat]);

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <PageHeading>Glossary</PageHeading>
          <p className="mt-3 text-lg font-light leading-relaxed text-indigo-100/70">
            Plain-language definitions for forex and trading terms used across calculators and the learn section.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full rounded-2xl border border-white/10 bg-[#0d1323]/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              aria-label="Search glossary"
            />
          </div>
          <label className="sr-only" htmlFor="glossary-category">
            Category
          </label>
          <select
            id="glossary-category"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#0d1323]/80 px-4 py-3 text-sm text-white focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="All">All categories</option>
            {glossaryCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-center text-xs text-slate-500">
          Showing {filtered.length} of {glossaryTerms.length} terms
        </p>

        <dl className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t.slug}
              id={t.slug}
              className="scroll-mt-28 rounded-2xl border border-white/5 bg-[#0d1323]/60 p-5 backdrop-blur-xl lg:scroll-mt-32"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <dt className="text-lg font-bold text-white">{t.term}</dt>
                <span className="rounded-full bg-white/5 px-3 py-0.5 text-xs font-semibold text-indigo-300 ring-1 ring-white/10">
                  {t.category}
                </span>
              </div>
              <dd className="mt-2 text-sm leading-relaxed text-slate-400">{t.definition}</dd>
            </div>
          ))}
        </dl>

        {filtered.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-[#12192b]/50 p-8 text-center text-slate-400">
            No terms match your filters. Try a shorter search or pick “All categories”.
          </p>
        )}
      </div>
    </main>
  );
}

import { Link } from 'react-router-dom';
import { Calculator, BookOpen, Newspaper, LineChart, ArrowRight, BookMarked, Globe2, FileText } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle('Forex Tools — Home');

  const cards = [
    {
      to: '/calculators',
      title: 'Trading calculators',
      desc: 'Profit and loss, margin, lot size, and swap tools in one place.',
      icon: Calculator,
      accent: 'from-blue-500/20 to-indigo-500/10',
    },
    {
      to: '/charts',
      title: 'Market charts',
      desc: 'Hourly price history from public market data to spot trends.',
      icon: LineChart,
      accent: 'from-amber-500/20 to-orange-500/10',
    },
    {
      to: '/market-hours',
      title: 'Sessions',
      desc: 'Major market windows in UTC and which session is open right now.',
      icon: Globe2,
      accent: 'from-teal-500/20 to-emerald-500/10',
    },
    {
      to: '/news',
      title: 'Headlines',
      desc: 'Curated forex-related news with quick links to full articles.',
      icon: Newspaper,
      accent: 'from-purple-500/20 to-indigo-500/10',
    },
    {
      to: '/learn',
      title: 'Learn the basics',
      desc: 'Currency pairs, pips, spreads, lots, and leverage explained clearly.',
      icon: BookOpen,
      accent: 'from-emerald-500/20 to-teal-500/10',
    },
    {
      to: '/blog',
      title: 'Week in FX',
      desc: 'Short weekly notes on risk, rollover, and how to use the tools.',
      icon: FileText,
      accent: 'from-violet-500/20 to-fuchsia-500/10',
    },
    {
      to: '/glossary',
      title: 'Glossary',
      desc: 'Search trading terms from pips and margin to slippage and volatility.',
      icon: BookMarked,
      accent: 'from-cyan-500/20 to-blue-500/10',
    },
  ];

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-12 lg:py-16">
      <div className="w-full max-w-6xl space-y-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <PageHeading>Plan trades with clarity</PageHeading>
          <p className="text-lg font-light leading-relaxed text-indigo-100/75">
            Free calculators, learn content, charts, news, glossary, sessions, and Week in FX notes — built for quick
            checks and context, not noise.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/calculators"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Open calculators
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              About this site
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ to, title, desc, icon: Icon, accent }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br ${accent} p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-indigo-500/30 hover:shadow-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d1323]/80 text-indigo-300 ring-1 ring-white/10">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0 space-y-2 text-left">
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-200 transition">{title}</h2>
                  <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
                    Go
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

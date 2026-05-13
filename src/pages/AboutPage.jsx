import { Link } from 'react-router-dom';
import {
  Calculator,
  BookOpen,
  LineChart,
  Newspaper,
  Sparkles,
  BookMarked,
  Globe2,
  FileText,
} from 'lucide-react';
import PageHeading from '../components/PageHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const comingSoon = [
  { title: 'Pip value calculator', desc: 'Per-pair pip worth in your account currency.' },
  { title: 'Position size from risk %', desc: 'Size a trade from stop distance and account risk.' },
  { title: 'Currency converter', desc: 'Quick spot conversions with manual rates.' },
  { title: 'Trade journal export', desc: 'CSV or PDF summaries from saved calculator presets.' },
];

const features = [
  {
    to: '/calculators',
    title: 'Trading calculators',
    icon: Calculator,
    body:
      'Estimate profit or loss on a trade, required margin, sensible lot size from your risk rules, and overnight swap for positions you hold past rollover. Each tool is meant for planning and comparison — always confirm numbers with your broker’s specs.',
  },
  {
    to: '/learn',
    title: 'Learn',
    icon: BookOpen,
    body:
      'Short explanations of how forex works: currency pairs, pips and spread, lots and leverage. Use it as a quick refresher before you plug values into the calculators.',
  },
  {
    to: '/charts',
    title: 'Charts',
    icon: LineChart,
    body:
      'Hourly price history so you can see recent direction and volatility at a glance. Pairs shown are for illustration; they are not a substitute for your trading platform’s live charts.',
  },
  {
    to: '/news',
    title: 'News',
    icon: Newspaper,
    body:
      'Headlines pulled from a public forex news feed so you can scan what is moving markets and open full articles when something matters to your session.',
  },
  {
    to: '/glossary',
    title: 'Glossary',
    icon: BookMarked,
    body:
      'Searchable definitions from ask price to volatility — aligned with language used in the calculators and learn section.',
  },
  {
    to: '/market-hours',
    title: 'Sessions & market hours',
    icon: Globe2,
    body:
      'Approximate Sydney, Tokyo, London, and New York windows in UTC plus a live “open now” hint for planning when liquidity is usually deeper.',
  },
  {
    to: '/blog',
    title: 'Week in FX',
    icon: FileText,
    body:
      'Short weekly-style notes on risk, rollover, and session behavior — easy to replace with your own posts or a CMS when you scale the site.',
  },
];

export default function AboutPage() {
  useDocumentTitle('Forex Tools — About');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center">
          <PageHeading>About Forex Tools</PageHeading>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Forex Tools brings together calculators, learn content, charts, news, a glossary, session map, and Week in
            FX notes in one place. The goal is simple: help you sanity-check sizes, costs, and context without replacing
            your broker or your own research.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider text-indigo-400">What’s on this site</h2>
          <ul className="space-y-4">
            {features.map(({ to, title, icon: Icon, body }) => (
              <li
                key={to}
                className="rounded-3xl border border-white/5 bg-[#0d1323]/60 p-6 backdrop-blur-xl md:flex md:gap-5 md:p-8"
              >
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 md:mb-0">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <Link
                      to={to}
                      className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                    >
                      Open →
                    </Link>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3 px-1">
            <Sparkles className="h-6 w-6 text-amber-400" aria-hidden />
            <h2 className="text-xl font-bold text-white">Ideas for later</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500">
            Features that could be added over time — not promised, just a direction if you keep building the product.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {comingSoon.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/5 bg-[#12192b]/80 p-5 ring-1 ring-white/5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Coming soon</p>
                <p className="mt-2 font-semibold text-slate-100">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-6">
          <h2 className="text-lg font-bold text-amber-100">Important</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
            Calculators use simplified assumptions you must verify with your broker (contract size, tick value, swap
            table, margin model). News and charts depend on outside services and can lag or fail. Nothing on this site
            is trading or investment advice; you use it at your own risk.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-3 pb-4">
          <Link
            to="/calculators"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            Go to calculators
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

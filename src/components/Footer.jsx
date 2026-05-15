import { Link } from 'react-router-dom';
import { LineChart } from 'lucide-react';

const footerSections = [
  {
    title: 'Tools',
    links: [
      { to: '/calculators', label: 'Calculators' },
      { to: '/market-today', label: 'Market Today' },
      { to: '/market-hours', label: 'Sessions' },
      { to: '/charts', label: 'Charts' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/blog', label: 'Blogs' },
      { to: '/learn', label: 'Learn' },
      { to: '/glossary', label: 'Glossary' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
    ],
  },
];

const footerLinkClass =
  'inline-block text-sm text-slate-400 transition-colors hover:text-white focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050810] rounded-sm';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050810]" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 rounded-lg text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <LineChart className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-base font-bold tracking-tight">Forex Tools</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Free forex calculators, market insights, and educational content to help you plan trades with clarity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-7 lg:gap-10">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">{section.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400/90">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            This site provides calculators and educational content for informational purposes only. Nothing here is
            financial, investment, or trading advice. Market prices and news are from third-party sources and may be
            delayed or inaccurate. Always verify figures with your broker and consult a qualified professional before
            making trading decisions.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">&copy; {year} Forex Tools. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built for traders worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

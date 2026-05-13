import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, LineChart } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/calculators', label: 'Calculators' },
  { to: '/charts', label: 'Charts' },
  { to: '/market-hours', label: 'Sessions' },
  { to: '/news', label: 'News' },
  { to: '/learn', label: 'Learn' },
  { to: '/blog', label: 'Blog' },
  { to: '/glossary', label: 'Glossary' },
];

const linkClass = ({ isActive }) =>
  [
    'rounded-lg px-2.5 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:px-3 sm:text-sm',
    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
  ].join(' ');

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070b14]/85 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:h-16" aria-label="Primary">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <LineChart className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden font-bold tracking-tight sm:inline text-base">Forex Tools</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/5 bg-[#0a0f1a]/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

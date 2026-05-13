import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#050810]/90">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Disclaimer</p>
            <p className="text-sm leading-relaxed text-slate-400">
              This site provides calculators and educational content for informational purposes only. Nothing here is
              financial, investment, or trading advice. Market prices and news are from third-party sources and may be
              delayed or inaccurate. Always verify figures with your broker and consult a qualified professional before
              making trading decisions.
            </p>
          </div>
          <div className="flex max-w-md flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/calculators" className="text-slate-400 hover:text-white transition">
              Calculators
            </Link>
            <Link to="/learn" className="text-slate-400 hover:text-white transition">
              Learn
            </Link>
            <Link to="/glossary" className="text-slate-400 hover:text-white transition">
              Glossary
            </Link>
            <Link to="/market-hours" className="text-slate-400 hover:text-white transition">
              Sessions
            </Link>
            <Link to="/blog" className="text-slate-400 hover:text-white transition">
              Blog
            </Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition">
              About
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Forex Tools. Built with ❤️ for traders worldwide.
        </p>
      </div>
    </footer>
  );
}

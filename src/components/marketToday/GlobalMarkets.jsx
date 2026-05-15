import { useEffect, useState } from 'react';
import { fetchGlobalMarkets } from '../../api/marketToday';

const REGIONS = [
  { key: 'US', title: 'US Markets' },
  { key: 'Europe', title: 'European Markets' },
  { key: 'Asia', title: 'Asian Markets' },
];

function MarketCard({ item }) {
  const change = Number(item.change_value);
  const positive = change >= 0;
  const accent = positive ? 'bg-emerald-500' : 'bg-rose-500';
  const changeClass = positive ? 'text-emerald-400' : 'text-rose-400';

  return (
    <article className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1a]/80 p-4">
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} aria-hidden />
      <div className="flex items-start justify-between gap-2 pl-2">
        
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.symbol}</p>
          <p className="mt-1 font-mono text-lg font-bold tabular-nums text-white">{item.current_price}</p>
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
            item.market_status
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30'
          }`}
        >
          {item.market_status ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
      <p className={`mt-2 pl-2 text-right text-sm font-medium tabular-nums ${changeClass}`}>
        {positive ? '▲' : '▼'} {item.change_value} ({item.change_per}%)
      </p>
    </article>
  );
}

export default function GlobalMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGlobalMarkets();
        if (!cancelled) setMarkets(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load global markets.');
          setMarkets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = REGIONS.map((region) => ({
    ...region,
    items: markets.filter((m) => m.country === region.key),
  }));

  return (
    <section className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">Global Markets</h2>

      {error && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-950/25 p-4 text-sm text-amber-100/90">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-500">Loading global markets…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {grouped.map((column) => (
            <div key={column.key}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">{column.title}</h3>
              <ul className="space-y-3">
                {column.items.length === 0 ? (
                  <li className="text-sm text-slate-500">No data available.</li>
                ) : (
                  column.items.map((item) => (
                    <li key={`${column.key}-${item.symbol}`}>
                      <MarketCard item={item} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from 'lucide-react';
import { fetchPerpetualFutures } from '../../api/marketToday';
import { formatFundingRate, formatPrice, formatUsdCompact } from '../../utils/formatMarket';

const CATEGORIES = [
  { id: '', label: 'ALL' },
  { id: 'ai', label: 'AI' },
  { id: 'defi', label: 'DEFI' },
  { id: 'gaming', label: 'GAMING' },
  { id: 'layer_1', label: 'LAYER 1' },
  { id: 'layer_2', label: 'LAYER 2' },
  { id: 'meme', label: 'MEME' },
  { id: 'metal', label: 'METAL' },
  { id: 'new', label: 'NEW' },
  { id: 'nft', label: 'NFT' },
  { id: 'smart_contracts', label: 'SMART CONTRACTS' },
  { id: 'sol_ecosystem', label: 'SOLANA ECOSYSTEM' },
  { id: 'xStock', label: 'XSTOCK' },
];

const PAGE_SIZES = [10, 20, 50, 100];

const COLUMNS = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'close', label: 'LTP', numeric: true },
  { key: 'high', label: 'High', numeric: true },
  { key: 'low', label: 'Low', numeric: true },
  { key: 'mark_price', label: 'Mark Price', numeric: true },
  { key: 'ltp_change_24h', label: 'Chg%', numeric: true },
  { key: 'oi_value_usd', label: 'OI (USD)', numeric: true },
  { key: 'turnover_usd', label: 'Turnover (USD)', numeric: true },
  { key: 'funding_rate', label: 'Funding Rate', numeric: true },
  { key: 'description', label: 'Description' },
];

function rowSearchText(row) {
  return [
    row.symbol,
    row.description,
    row.tags,
    row.close,
    row.high,
    row.low,
    row.mark_price,
    row.ltp_change_24h,
    row.turnover_usd,
    row.oi_value_usd,
    row.funding_rate,
  ]
    .filter((v) => v != null)
    .join(' ')
    .toLowerCase();
}

function SortIcon({ active, dir }) {
  if (!active) {
    return <ChevronDown className="h-3 w-3 opacity-30" aria-hidden />;
  }
  return dir === 'asc' ? (
    <ChevronUp className="h-3 w-3 text-indigo-400" aria-hidden />
  ) : (
    <ChevronDown className="h-3 w-3 text-indigo-400" aria-hidden />
  );
}

function CellValue({ col, row }) {
  if (col.key === 'ltp_change_24h') {
    const n = Number(row.ltp_change_24h);
    const positive = n >= 0;
    return (
      <span className={positive ? 'text-emerald-400' : 'text-rose-400'}>
        {Number.isFinite(n) ? `${n.toFixed(2)}%` : '—'}
      </span>
    );
  }
  if (col.key === 'funding_rate') {
    const n = Number(row.funding_rate);
    const positive = n >= 0;
    return (
      <span className={positive ? 'text-emerald-400' : 'text-rose-400'}>
        {formatFundingRate(row.funding_rate)}
      </span>
    );
  }
  if (col.key === 'oi_value_usd') return formatUsdCompact(row.oi_value_usd);
  if (col.key === 'turnover_usd') return formatUsdCompact(row.turnover_usd);
  if (col.key === 'close' || col.key === 'high' || col.key === 'low' || col.key === 'mark_price') {
    return formatPrice(row[col.key]);
  }
  return row[col.key] ?? '—';
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('…');
    out.push(sorted[i]);
  }
  return out;
}

export default function PerpetualFuturesTable() {
  const [category, setCategory] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('turnover_usd');
  const [sortDir, setSortDir] = useState('desc');

  const loadData = useCallback(async (tag) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPerpetualFutures(tag);
      setRows(data);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Could not load perpetual futures.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadData(category);
  }, [category, loadData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows;
    if (q) list = list.filter((row) => rowSearchText(row).includes(q));

    const col = COLUMNS.find((c) => c.key === sortKey);
    if (!col) return list;

    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (col.numeric) {
        const an = Number(av);
        const bn = Number(bv);
        return sortDir === 'asc' ? an - bn : bn - an;
      }
      const as = String(av ?? '').toLowerCase();
      const bs = String(bv ?? '').toLowerCase();
      if (as < bs) return sortDir === 'asc' ? -1 : 1;
      if (as > bs) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const pageNumbers = buildPageNumbers(safePage, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-[#0d1323]/70 p-4 backdrop-blur-xl md:p-6">
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id || 'all'}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs ${
              category === cat.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-white/10 bg-[#0a0f1a] px-2 py-1.5 text-sm text-slate-200 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          rows
        </label>

        <label className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search stocks…"
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1a] py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-950/25 p-4 text-sm text-amber-100/90">
          {error}
        </div>
      )}

      <div className="mt-4 overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-300"
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-10 text-center text-slate-500">
                  Loading perpetual futures…
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-10 text-center text-slate-500">
                  No results found.
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={row.symbol}
                  className={`border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 tabular-nums ${
                        col.key === 'symbol' ? 'font-semibold text-white' : 'text-slate-300'
                      }`}
                    >
                      <CellValue col={col} row={row} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {filtered.length === 0
            ? 'Showing 0 results'
            : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length} results`}
        </p>

        <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Pagination">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-white/10 p-2 text-slate-400 enabled:hover:bg-white/5 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((n, i) =>
            n === '…' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-slate-500">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`min-w-9 rounded-lg border px-2 py-1.5 text-sm font-medium ${
                  safePage === n
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-white/10 p-2 text-slate-400 enabled:hover:bg-white/5 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </section>
  );
}

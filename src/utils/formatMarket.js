export function formatUsdCompact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatPrice(value, decimals = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) < 0.01 && n !== 0) return n.toPrecision(4);
  if (Math.abs(n) < 1) return n.toFixed(4);
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatFundingRate(rate) {
  const n = Number(rate);
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(4)}%`;
}

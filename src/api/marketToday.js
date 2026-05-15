/** Same-origin proxy: Vite dev (vite.config) + Vercel (vercel.json) → avoids browser CORS */
const API_BASE = '/api/nifty';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  const data = await res.json();
  if (data.result !== 1) {
    throw new Error(data.resultMessage || 'API returned an error');
  }
  return data.resultData;
}

export function mergePerpetualRows(resultData) {
  const gainers = Array.isArray(resultData?.gainers) ? resultData.gainers : [];
  const losers = Array.isArray(resultData?.losers) ? resultData.losers : [];
  const bySymbol = new Map();
  for (const row of [...gainers, ...losers]) {
    if (row?.symbol) bySymbol.set(row.symbol, row);
  }
  return Array.from(bySymbol.values());
}

export async function fetchPerpetualFutures(tag = '') {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : '?tag=';
  const resultData = await fetchJson(`${API_BASE}/Symbol/perpetual-futures${query}`);
  return mergePerpetualRows(resultData);
}

export async function fetchGlobalMarkets() {
  const resultData = await fetchJson(`${API_BASE}/usstock/global-market`);
  return Array.isArray(resultData) ? resultData : [];
}

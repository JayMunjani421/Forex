import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#12192b] border border-slate-700/60 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-indigo-400 font-bold text-sm">
          Price: {payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
      </div>
    );
  }
  return null;
};

const Charts = () => {
  const [btcData, setBtcData] = useState([]);
  const [xauData, setXauData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const loadCharts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const btcRes = await fetch('https://api.kraken.com/0/public/OHLC?pair=BTCUSD&interval=60');
      const btcJson = await btcRes.json();
      const btcPairData = Object.values(btcJson.result || {}).find((v) => Array.isArray(v)) || [];

      const formattedBtc = btcPairData
        .map((d) => ({
          time: format(new Date(d[0] * 1000), 'MMM dd, HH:mm'),
          price: parseFloat(d[4]),
        }))
        .slice(-100);

      setBtcData(formattedBtc);

      const xauRes = await fetch('https://api.kraken.com/0/public/OHLC?pair=PAXGUSD&interval=60');
      const xauJson = await xauRes.json();
      const xauPairData = Object.values(xauJson.result || {}).find((v) => Array.isArray(v)) || [];

      const formattedXau = xauPairData
        .map((d) => ({
          time: format(new Date(d[0] * 1000), 'MMM dd, HH:mm'),
          price: parseFloat(d[4]),
        }))
        .slice(-100);

      setXauData(formattedXau);

      if (formattedBtc.length === 0 && formattedXau.length === 0) {
        setError('No chart data was returned. The exchange API may be busy or the pair mapping may have changed.');
      }
    } catch (err) {
      console.error('Error fetching charts:', err);
      setError('We could not load chart data. Check your connection and try again.');
      setBtcData([]);
      setXauData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharts();
  }, [loadCharts, reloadToken]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/5 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" aria-hidden />
        <span className="sr-only">Loading charts</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#0d1323]/80 p-10 text-center backdrop-blur-2xl">
        <p className="text-slate-200 font-semibold">Charts unavailable</p>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          onClick={() => setReloadToken((t) => t + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BTCUSD Chart */}
        <div className="bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              BTC/USD
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">Hourly</span>
          </div>
          <div className="h-64 w-full">
            {btcData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">No BTC data for this range.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={btcData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f6931a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f6931a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                  <YAxis
                    dataKey="price"
                    stroke="#475569"
                    fontSize={10}
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#f6931a" strokeWidth={2} fillOpacity={1} fill="url(#colorBtc)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* XAUUSD Chart */}
        <div className="bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              XAU/USD (Gold)
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">Hourly</span>
          </div>
          <div className="h-64 w-full">
            {xauData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">No gold proxy data for this range.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xauData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                  <YAxis
                    dataKey="price"
                    stroke="#475569"
                    fontSize={10}
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorXau)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;

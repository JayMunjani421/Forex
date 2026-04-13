import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);

        // Fetch BTCUSD from Kraken
        const btcRes = await fetch('https://api.kraken.com/0/public/OHLC?pair=BTCUSD&interval=60');
        const btcJson = await btcRes.json();
        const btcRaw = btcJson.result?.XXBTZUSD || btcJson.result?.BTCUSD || [];
        // Map [time, open, high, low, close, vwap, volume, count]
        // Usually Kraken pairs map as XXBTZUSD in result, we'll use Object.values
        const btcPairData = Object.values(btcJson.result || {}).find(v => Array.isArray(v)) || [];
        
        const formattedBtc = btcPairData.map(d => ({
          time: format(new Date(d[0] * 1000), 'MMM dd, HH:mm'),
          price: parseFloat(d[4]) // Close price
        })).slice(-100); // Last 100 periods

        setBtcData(formattedBtc);

        // Fetch XAUUSD from currencyappllc
        const xauRes = await fetch('https://api.currencyappllc.com/v1/graph/XAU/USD?interval=1d', {
          headers: {
            'Host': 'api.currencyappllc.com',
            'accept': '/',
            'user-agent': 'Currency/109 CFNetwork/1496.0.7 Darwin/23.5.0',
            'accept-language': 'en-GB,en;q=0.9'
          }
        });
        const xauJson = await xauRes.json();
        
        const formattedXau = Object.entries(xauJson)
          .map(([dateString, price]) => ({
            time: format(new Date(dateString), 'MMM dd, HH:mm'),
            price: price
          }))
          .slice(-100); // Last 100 periods
          
        setXauData(formattedXau);

      } catch (err) {
        console.error('Error fetching charts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/5 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BTCUSD Chart */}
        <div className="bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              BTC/USD
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">Hourly</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={btcData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f6931a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f6931a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                <YAxis dataKey="price" stroke="#475569" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke="#f6931a" strokeWidth={2} fillOpacity={1} fill="url(#colorBtc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XAUUSD Chart */}
        <div className="bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              XAU/USD (Gold)
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">Daily</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xauData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} minTickGap={30} />
                <YAxis dataKey="price" stroke="#475569" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorXau)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Charts;

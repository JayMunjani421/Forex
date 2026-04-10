import { useState, useEffect } from 'react';
import { Minus, Plus, RefreshCw } from 'lucide-react';

const Calculator = () => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [currency, setCurrency] = useState('USD');
  const [days, setDays] = useState(1);
  const [volume, setVolume] = useState(1.0);
  const [openPrice, setOpenPrice] = useState();
  const [closePrice, setClosePrice] = useState();
  const [direction, setDirection] = useState('Buy');
  const [livePrice, setLivePrice] = useState(null);
  const [hasInitializedLivePrice, setHasInitializedLivePrice] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    setHasInitializedLivePrice(false);
    setLivePrice(null);
    let intervalId;
    const fetchLivePrice = async () => {
      try {
        const res = await fetch(`https://www.fxtm.com/informers/rates/symbols?symbols=${symbol}`);
        const data = await res.json();
        if (data && data[symbol] && data[symbol].bid) {
          setLivePrice(parseFloat(data[symbol].bid));
        }
      } catch (err) {
        console.error('Error fetching live price:', err);
      }
    };

    fetchLivePrice();
    // Poll every 3 seconds for real-time updates
    intervalId = setInterval(fetchLivePrice, 3000); 

    return () => clearInterval(intervalId);
  }, [symbol]);

  useEffect(() => {
    if (livePrice && !hasInitializedLivePrice) {
      setOpenPrice(livePrice.toFixed(5));
      setClosePrice((livePrice - 0.0001).toFixed(5));
      setHasInitializedLivePrice(true);
    }
  }, [livePrice, hasInitializedLivePrice]);

  const [result, setResult] = useState({
    profit: 0.0,
    grossProfit: 0.0,
    fees: 0.0,
  });

  const handleCalculate = () => {
    // Standard contract size is 100,000 units
    const contractSize = 100000;
    let profit = 0;

    const parsedOpen = parseFloat(openPrice) || 0;
    const parsedClose = parseFloat(closePrice) || 0;

    if (direction === 'Buy') {
      profit = (parsedClose - parsedOpen) * contractSize * volume;
    } else {
      profit = (parsedOpen - parsedClose) * contractSize * volume;
    }

    setResult({
      profit: parseFloat(profit.toFixed(2)),
      grossProfit: parseFloat(profit.toFixed(2)),
      fees: 0.0,
    });
    setHasCalculated(true);
  };

  const increment = (setter, value, step, formatDecimals) => {
    const nextVal = parseFloat(value) + step;
    setter(formatDecimals !== undefined ? nextVal.toFixed(formatDecimals) : parseFloat(nextVal.toFixed(4)));
  };

  const decrement = (setter, value, step, min = 0, formatDecimals) => {
    const nextVal = parseFloat(value) - step;
    if (nextVal >= min) {
      setter(formatDecimals !== undefined ? nextVal.toFixed(formatDecimals) : parseFloat(nextVal.toFixed(4)));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-12 border border-white/5 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
        {/* Left Side: Form */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Symbol */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Symbol
                {livePrice && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5 ml-2 normal-case tracking-normal" title="Live Market Price">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse border border-emerald-300"></span>
                    {livePrice.toFixed(5)}
                  </span>
                )}
              </label>
              <select 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 font-semibold text-lg cursor-pointer appearance-none mt-1"
              >
                <option value="EURUSD" className="bg-slate-900">EURUSD</option>
                <option value="GBPUSD" className="bg-slate-900">GBPUSD</option>
                <option value="USDJPY" className="bg-slate-900">USDJPY</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Open Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md flex items-center gap-2">
                Open price
                {livePrice && (
                  <button 
                    onClick={() => {
                      setOpenPrice(livePrice.toFixed(5));
                      setClosePrice((livePrice - 0.0001).toFixed(5));
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded cursor-pointer ml-1 normal-case tracking-normal"
                    title="Update to live price"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setOpenPrice, openPrice, 0.00001, 0, 5)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                step="0.00001"
                value={openPrice ?? ''}
                onChange={(e) => setOpenPrice(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    setOpenPrice(parseFloat(e.target.value).toFixed(5));
                  }
                }}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setOpenPrice, openPrice, 0.00001, 5)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Account currency */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">Account currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 font-semibold text-lg cursor-pointer appearance-none mt-1"
              >
                <option value="USD" className="bg-slate-900">USD</option>
                <option value="EUR" className="bg-slate-900">EUR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Close Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md flex items-center gap-2">
                Close price
                {livePrice && (
                  <button 
                    onClick={() => {
                      setOpenPrice(livePrice.toFixed(5));
                      setClosePrice((livePrice - 0.0001).toFixed(5));
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded cursor-pointer ml-1 normal-case tracking-normal"
                    title="Update to live price"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setClosePrice, closePrice, 0.00001, 0, 5)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                step="0.00001"
                value={closePrice ?? ''}
                onChange={(e) => setClosePrice(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    setClosePrice(parseFloat(e.target.value).toFixed(5));
                  }
                }}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setClosePrice, closePrice, 0.00001, 5)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Period in days */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">Period in days</label>
              <button onClick={() => decrement(setDays, days, 1, 1)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={days}
                onChange={(e) => setDays(parseFloat(e.target.value) || 1)}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setDays, days, 1)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">Volume, lots</label>
              <button onClick={() => decrement(setVolume, volume, 0.01, 0.01)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={volume}
                step="0.01"
                onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setVolume, volume, 0.01)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Direction */}
            <div className="col-span-1 md:col-span-2 flex w-full shadow-sm mt-2">
              <button 
                onClick={() => setDirection('Sell')}
                className={`w-1/2 py-3.5 border rounded-l-xl text-base font-bold transition-all outline-none z-10
                  ${direction === 'Sell' ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300 border-r-transparent'}
                `}
              >
                Sell
              </button>
              <button 
                onClick={() => setDirection('Buy')}
                className={`w-1/2 py-3.5 border rounded-r-xl text-base font-bold transition-all outline-none -ml-[1px]
                  ${direction === 'Buy' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 z-10' : 'border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300 z-0'}
                `}
              >
                Buy
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:w-[35%] flex flex-col justify-center">
          <div className="bg-[#12192b]/80 border border-slate-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
            {/* Inner subtle glow */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div> */}

            <h3 className="text-base font-bold uppercase tracking-wider text-indigo-400 mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-indigo-500/50"></span>
              Calculation Results
            </h3>
            
            <div className="space-y-8 relative z-10 w-full">
              <div className="flex justify-between items-end pb-6 border-b border-white/5">
                <span className="text-slate-400 font-medium">Profit</span>
                <span className={`text-4xl font-extrabold tracking-tight ${!hasCalculated ? 'text-slate-600' : result.profit < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {!hasCalculated ? '-' : `${result.profit < 0 ? '-' : ''}$${Math.abs(result.profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Gross profit</span>
                  <span className={`font-bold text-lg ${!hasCalculated ? 'text-slate-600' : result.grossProfit < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {!hasCalculated ? '-' : `${result.grossProfit < 0 ? '-' : ''}$${Math.abs(result.grossProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Trading fees</span>
                  <span className={`font-bold text-lg ${!hasCalculated ? 'text-slate-600' : 'text-slate-400'}`}>
                    {!hasCalculated ? '-' : `-$${result.fees.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end relative z-10">
        <button 
          onClick={handleCalculate}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] focus:ring-4 focus:ring-indigo-500/20 text-lg flex items-center justify-center gap-2 group"
        >
          Calculate
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>

    </div>
  );
};

export default Calculator;

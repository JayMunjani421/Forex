import { useState, useEffect } from 'react';
import { Minus, Plus, RefreshCw } from 'lucide-react';

const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "EURGBP", "EURJPY", "GBPJPY", "EURCHF", "EURAUD", "EURNZD", "EURCAD", "GBPCHF", "GBPAUD", "GBPNZD", "GBPCAD", "CHFJPY", "AUDJPY", "AUDCHF", "AUDNZD", "AUDCAD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "XAGUSD", "XAUUSD", "UK100", "GER40", "NAS100", "USDMXN", "USDZAR"
];

const Calculator = () => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [currency, setCurrency] = useState('USD');
  const [days, setDays] = useState(1);
  const [volume, setVolume] = useState(1.0);
  const [openPrice, setOpenPrice] = useState();
  const [closePrice, setClosePrice] = useState();
  const [direction, setDirection] = useState('Buy');
  const [liveData, setLiveData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rates, setRates] = useState({});
  const [hasInitializedLivePrice, setHasInitializedLivePrice] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    setHasInitializedLivePrice(false);
    setLiveData(null);
    let intervalId;
    const fetchLivePrice = async () => {
      try {
        const symbolsToFetch = [...new Set([symbol, 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD', 'USDJPY', 'USDCHF', 'USDCAD', 'USDMXN', 'USDZAR'])].join(',');
        const res = await fetch(`https://www.fxtm.com/informers/rates/symbols?symbols=${symbolsToFetch}`);
        const data = await res.json();
        if (data) {
          setRates(data);
          if (data[symbol]) {
            setLiveData(data[symbol]);
          }
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
    if (liveData && !hasInitializedLivePrice) {
      const digits = liveData.digits || 5;
      const openPriceVal = liveData.bid;
      const pipOffset = Math.pow(10, -(digits - 1));
      setOpenPrice(openPriceVal.toFixed(digits));
      setClosePrice((openPriceVal - pipOffset).toFixed(digits));
      setHasInitializedLivePrice(true);
    }
  }, [liveData, hasInitializedLivePrice, direction]);

  const currentDigits = liveData?.digits || 5;
  const currentStep = Number(Math.pow(10, -currentDigits).toFixed(currentDigits));

  const [result, setResult] = useState({
    profit: 0.0,
    grossProfit: 0.0,
    fees: 0.0,
    currency: 'USD'
  });

  const handleCalculate = () => {
    const CONTRACT_SIZES = {
      XAUUSD: 100,
      XAGUSD: 5000,
      UK100: 10,
      FRA40: 10,
      GER40: 10,
      NAS100: 10,
    };
    const contractSize = CONTRACT_SIZES[symbol] || 100000;
    
    const parsedOpen = parseFloat(openPrice) || 0;
    const parsedClose = parseFloat(closePrice) || 0;

    let baseProfit = 0;
    if (direction === 'Buy') {
      baseProfit = (parsedClose - parsedOpen) * contractSize * volume;
    } else {
      baseProfit = (parsedOpen - parsedClose) * contractSize * volume;
    }

    // Convert Quote Currency to USD
    let profitInUSD = baseProfit;
    const getQuoteCurrency = (sym) => {
      if (sym === 'UK100') return 'GBP';
      if (sym === 'FRA40' || sym === 'GER40') return 'EUR';
      if (sym === 'NAS100') return 'USD';
      if (sym.length === 6) return sym.substring(3, 6);
      return 'USD';
    };
    
    const quoteCur = getQuoteCurrency(symbol);
    
    if (quoteCur !== 'USD') {
      if (quoteCur === 'EUR' && rates['EURUSD']) profitInUSD = baseProfit * rates['EURUSD'].bid;
      else if (quoteCur === 'GBP' && rates['GBPUSD']) profitInUSD = baseProfit * rates['GBPUSD'].bid;
      else if (quoteCur === 'AUD' && rates['AUDUSD']) profitInUSD = baseProfit * rates['AUDUSD'].bid;
      else if (quoteCur === 'NZD' && rates['NZDUSD']) profitInUSD = baseProfit * rates['NZDUSD'].bid;
      else if (quoteCur === 'JPY' && rates['USDJPY']) profitInUSD = baseProfit / rates['USDJPY'].bid;
      else if (quoteCur === 'CHF' && rates['USDCHF']) profitInUSD = baseProfit / rates['USDCHF'].bid;
      else if (quoteCur === 'CAD' && rates['USDCAD']) profitInUSD = baseProfit / rates['USDCAD'].bid;
      else if (quoteCur === 'MXN' && rates['USDMXN']) profitInUSD = baseProfit / rates['USDMXN'].bid;
      else if (quoteCur === 'ZAR' && rates['USDZAR']) profitInUSD = baseProfit / rates['USDZAR'].bid;
    }

    // Convert to Account Currency
    let finalProfit = profitInUSD;
    if (currency === 'EUR' && rates['EURUSD']) {
      finalProfit = profitInUSD / rates['EURUSD'].bid;
    }

    setResult({
      profit: parseFloat(finalProfit.toFixed(2)),
      grossProfit: parseFloat(finalProfit.toFixed(2)),
      fees: 0.0,
      currency: currency
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

  const formatCurrencyValue = (val) => {
    const sym = result.currency === 'EUR' ? '€' : '$';
    return `${val < 0 ? '-' : ''}${sym}${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                {liveData && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5 ml-2 normal-case tracking-normal" title="Live Market Price">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse border border-emerald-300"></span>
                    {liveData.bid.toFixed(liveData.digits || 5)}
                  </span>
                )}
              </label>
              <div 
                className="w-full mt-1 relative"
                onClick={() => setIsDropdownOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-slate-100 font-semibold text-lg">{symbol}</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2">
                      <div className="relative mb-2">
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search symbols..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#0c1221] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {SYMBOLS.filter(sym => sym.toLowerCase().includes(searchQuery.toLowerCase())).map(sym => (
                          <div 
                            key={sym} 
                            className={`px-3 py-2.5 rounded-lg cursor-pointer text-base font-medium ${symbol === sym ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSymbol(sym);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            {sym}
                          </div>
                        ))}
                        {SYMBOLS.filter(sym => sym.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-slate-500 text-sm text-center">No symbols found</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Open Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md flex items-center gap-2">
                Open price
                {liveData && (
                  <button 
                    onClick={() => {
                      const digits = liveData.digits || 5;
                      const openPriceVal = liveData.bid;
                      const pipOffset = Math.pow(10, -(digits - 1));
                      setOpenPrice(openPriceVal.toFixed(digits));
                      setClosePrice((openPriceVal - pipOffset).toFixed(digits));
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded cursor-pointer ml-1 normal-case tracking-normal"
                    title="Update to live prices"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setOpenPrice, openPrice, currentStep, 0, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                step={currentStep}
                value={openPrice ?? ''}
                onChange={(e) => setOpenPrice(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    setOpenPrice(parseFloat(e.target.value).toFixed(currentDigits));
                  }
                }}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setOpenPrice, openPrice, currentStep, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Account currency */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">Account currency</label>
              <div 
                className="w-full mt-1 relative"
                onClick={() => setIsCurrencyDropdownOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-slate-100 font-semibold text-lg">{currency}</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isCurrencyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsCurrencyDropdownOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2 custom-scrollbar overflow-y-auto max-h-48">
                      {['USD', 'EUR'].map(curr => (
                        <div 
                          key={curr} 
                          className={`px-3 py-2.5 rounded-lg cursor-pointer text-base font-medium ${currency === curr ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrency(curr);
                            setIsCurrencyDropdownOpen(false);
                          }}
                        >
                          {curr}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Close Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md flex items-center gap-2">
                Close price
              </label>
              <button onClick={() => decrement(setClosePrice, closePrice, currentStep, 0, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                step={currentStep}
                value={closePrice ?? ''}
                onChange={(e) => setClosePrice(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    setClosePrice(parseFloat(e.target.value).toFixed(currentDigits));
                  }
                }}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-lg mt-1"
              />
              <button onClick={() => increment(setClosePrice, closePrice, currentStep, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-1">
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
                className={`w-1/2 py-3.5 border rounded-r-xl text-base font-bold transition-all outline-none -ml-px
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
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

            <h3 className="text-base font-bold uppercase tracking-wider text-indigo-400 mb-8 flex items-center gap-3">
              Final Results
            </h3>
            
            <div className="space-y-8 relative z-10 w-full">
              <div className="flex justify-between items-center pb-6 border-b border-white/5 gap-4">
                <span className="text-slate-400 font-medium shrink-0">Profit</span>
                <span 
                  className={`font-extrabold tracking-tight break-all text-right ${
                    !hasCalculated ? 'text-4xl text-slate-600' : 
                    formatCurrencyValue(result.profit).length > 15 ? 'text-2xl sm:text-3xl' : 'text-4xl'
                  } ${!hasCalculated ? '' : result.profit < 0 ? 'text-rose-400' : 'text-emerald-400'}`}
                >
                  {!hasCalculated ? '-' : formatCurrencyValue(result.profit)}
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center group gap-4">
                  <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors shrink-0">Gross profit</span>
                  <span className={`font-bold text-right break-all ${
                    !hasCalculated ? 'text-lg text-slate-600' : 
                    formatCurrencyValue(result.grossProfit).length > 20 ? 'text-sm' : 'text-lg'
                  } ${!hasCalculated ? '' : result.grossProfit < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {!hasCalculated ? '-' : formatCurrencyValue(result.grossProfit)}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Trading fees</span>
                  <span className={`font-bold text-lg ${!hasCalculated ? 'text-slate-600' : 'text-slate-400'}`}>
                    {!hasCalculated ? '-' : `-${result.currency === 'EUR' ? '€' : '$'}${result.fees.toFixed(2)}`}
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
          className="w-full md:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] focus:ring-4 focus:ring-indigo-500/20 text-lg flex items-center justify-center gap-2 group"
        >
          Calculate
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>

    </div>
  );
};

export default Calculator;

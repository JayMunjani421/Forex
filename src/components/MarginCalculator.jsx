import { useState, useEffect } from 'react';
import { Minus, Plus, RefreshCw } from 'lucide-react';

const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "EURGBP", "EURJPY", "GBPJPY", "EURCHF", "EURAUD", "EURNZD", "EURCAD", "GBPCHF", "GBPAUD", "GBPNZD", "GBPCAD", "CHFJPY", "AUDJPY", "AUDCHF", "AUDNZD", "AUDCAD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "XAGUSD", "XAUUSD", "UK100", "GER40", "NAS100", "USDMXN", "USDZAR"
];

const MarginCalculator = () => {
  const [symbol, setSymbol] = useState('');
  const [currency, setCurrency] = useState('');
  const [volume, setVolume] = useState('');
  const [leverage, setLeverage] = useState('');
  const [openPrice, setOpenPrice] = useState('');
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
      setOpenPrice(openPriceVal.toFixed(digits));
      setHasInitializedLivePrice(true);
    }
  }, [liveData, hasInitializedLivePrice]);

  const currentDigits = liveData?.digits || 5;
  const currentStep = Number(Math.pow(10, -currentDigits).toFixed(currentDigits));

  const [result, setResult] = useState({
    margin: 0.0,
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
    
    // Leverage should be valid
    const lev = parseFloat(leverage);
    if (!lev || lev <= 0) return;

    let notionalUSD = 0;
    const vol = parseFloat(volume) || 0;

    const isMetalOrIndex = ['XAUUSD', 'XAGUSD', 'UK100', 'FRA40', 'GER40', 'NAS100'].includes(symbol);
    
    if (isMetalOrIndex) {
      const price = parseFloat(openPrice) || 0;
      let quoteCurrency = 'USD';
      if (symbol === 'UK100') quoteCurrency = 'GBP';
      if (symbol === 'FRA40' || symbol === 'GER40') quoteCurrency = 'EUR';
      
      let notionalQuote = vol * contractSize * price;
      
      if (quoteCurrency === 'USD') notionalUSD = notionalQuote;
      else if (quoteCurrency === 'EUR' && rates['EURUSD']) notionalUSD = notionalQuote * rates['EURUSD'].bid;
      else if (quoteCurrency === 'GBP' && rates['GBPUSD']) notionalUSD = notionalQuote * rates['GBPUSD'].bid;
      else notionalUSD = notionalQuote; // Fallback
    } else {
      // Forex
      const baseCurrency = symbol.substring(0, 3);
      const notionalBase = vol * contractSize;
      
      if (baseCurrency === 'USD') notionalUSD = notionalBase;
      else if (baseCurrency === 'EUR' && rates['EURUSD']) notionalUSD = notionalBase * rates['EURUSD'].bid;
      else if (baseCurrency === 'GBP' && rates['GBPUSD']) notionalUSD = notionalBase * rates['GBPUSD'].bid;
      else if (baseCurrency === 'AUD' && rates['AUDUSD']) notionalUSD = notionalBase * rates['AUDUSD'].bid;
      else if (baseCurrency === 'NZD' && rates['NZDUSD']) notionalUSD = notionalBase * rates['NZDUSD'].bid;
      else if (baseCurrency === 'JPY' && rates['USDJPY']) notionalUSD = notionalBase / rates['USDJPY'].bid;
      else if (baseCurrency === 'CHF' && rates['USDCHF']) notionalUSD = notionalBase / rates['USDCHF'].bid;
      else if (baseCurrency === 'CAD' && rates['USDCAD']) notionalUSD = notionalBase / rates['USDCAD'].bid;
      else if (baseCurrency === 'MXN' && rates['USDMXN']) notionalUSD = notionalBase / rates['USDMXN'].bid;
      else if (baseCurrency === 'ZAR' && rates['USDZAR']) notionalUSD = notionalBase / rates['USDZAR'].bid;
      else notionalUSD = notionalBase; // Fallback
    }

    let marginRequired = notionalUSD / lev;

    // Convert to Account Currency
    let finalMargin = marginRequired;
    if (currency === 'EUR' && rates['EURUSD']) {
      finalMargin = marginRequired / rates['EURUSD'].bid;
    }

    setResult({
      margin: parseFloat(finalMargin.toFixed(2)),
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
    return `${sym}${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-12 border border-white/5 relative z-10">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-[-1]">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Symbol */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Symbol
                {liveData && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 ml-2 normal-case tracking-normal text-[11px]" title="Live Market Price">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse border border-emerald-300"></span>
                    {liveData.bid.toFixed(liveData.digits || 5)}
                  </span>
                )}
              </label>
              <div 
                className="w-full relative py-0.5"
                onClick={() => setIsDropdownOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className={`font-semibold text-[15px] ${!symbol ? 'text-slate-400' : 'text-slate-100'} truncate w-full`}>{symbol || 'Select Instrument'}</span>
                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                          className="w-full bg-[#0c1221] border border-slate-700/60 rounded-lg px-3 py-2 text-[15px] text-slate-200 outline-none focus:border-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {SYMBOLS.filter(sym => sym.toLowerCase().includes(searchQuery.toLowerCase())).map(sym => (
                          <div 
                            key={sym} 
                            className={`px-3 py-2.5 rounded-lg cursor-pointer text-[15px] font-medium ${symbol === sym ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
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

            {/* Account currency */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">Account currency</label>
              <div 
                className="w-full relative py-0.5"
                onClick={() => setIsCurrencyDropdownOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className={`font-semibold text-[15px] ${!currency ? 'text-slate-400' : 'text-slate-100'} truncate w-full`}>{currency || 'Select Currency'}</span>
                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isCurrencyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsCurrencyDropdownOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2 custom-scrollbar overflow-y-auto max-h-48">
                      {['USD', 'EUR'].map(curr => (
                        <div 
                          key={curr} 
                          className={`px-3 py-2.5 rounded-lg cursor-pointer text-[15px] font-medium ${currency === curr ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
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

            {/* Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md flex items-center gap-2">
                Price
                {liveData && (
                  <button 
                    onClick={() => {
                      const digits = liveData.digits || 5;
                      const openPriceVal = liveData.bid;
                      setOpenPrice(openPriceVal.toFixed(digits));
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded cursor-pointer ml-1 normal-case tracking-normal"
                    title="Update to live prices"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setOpenPrice, openPrice, currentStep, 0, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                step={currentStep}
                placeholder="Enter Price"
                value={openPrice ?? ''}
                onChange={(e) => setOpenPrice(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    setOpenPrice(parseFloat(e.target.value).toFixed(currentDigits));
                  }
                }}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-[15px] py-0.5"
              />
              <button onClick={() => increment(setOpenPrice, openPrice, currentStep, currentDigits)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Leverage */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">Leverage (1:X)</label>
              <button onClick={() => decrement(setLeverage, leverage, 10, 1)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                placeholder="Leverage"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value) || '')}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-[15px] py-0.5 placeholder:text-slate-500"
              />
              <button onClick={() => increment(setLeverage, leverage, 10)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">Volume, lots</label>
              <button onClick={() => decrement(setVolume, volume, 0.01, 0.01)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={volume}
                step="0.01"
                placeholder="Enter Size"
                onChange={(e) => setVolume(parseFloat(e.target.value) || '')}
                className="w-full text-center bg-transparent outline-none text-slate-100 font-semibold text-[15px] py-0.5 placeholder:text-slate-500"
              />
              <button onClick={() => increment(setVolume, volume, 0.01)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 mt-0.5">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Empty grid block to balance */}
            <div className="hidden md:block"></div>

          </div>

        </div>

        {/* Right Side: Results */}
        <div className="lg:w-[35%] flex flex-col justify-center">
          <div className="bg-[#12192b]/80 border border-slate-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full flex flex-col pt-12">
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-8 flex items-center gap-3">
              Final Results
            </h3>
            
            <div className="space-y-8 relative z-10 w-full">
              <div className="flex flex-col items-end pb-6 border-b border-white/5 gap-2">
                <span className="text-slate-400 font-medium w-full text-left text-sm">Required Margin</span>
                <span 
                  className={`font-extrabold tracking-tight break-all text-right w-full ${
                    !hasCalculated ? 'text-3xl text-slate-600' : 
                    formatCurrencyValue(result.margin).length > 15 ? 'text-xl sm:text-2xl' : 'text-3xl'
                  } ${!hasCalculated ? '' : 'text-emerald-400'}`}
                >
                  {!hasCalculated ? '-' : formatCurrencyValue(result.margin)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end relative z-10">
        <button 
          onClick={handleCalculate}
          disabled={!symbol || !currency || !openPrice || !leverage || volume === ''}
          className="w-full md:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] focus:ring-4 focus:ring-indigo-500/20 text-lg flex items-center justify-center gap-2 group"
        >
          Calculate
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>

    </div>
  );
};

export default MarginCalculator;

import { useState, useEffect } from 'react';
import { Minus, Plus, RefreshCw } from 'lucide-react';

const Calculator = () => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [currency, setCurrency] = useState('USD');
  const [days, setDays] = useState(1);
  const [volume, setVolume] = useState(1.0);
  const [openPrice, setOpenPrice] = useState(1.1);
  const [closePrice, setClosePrice] = useState(1.2);
  const [direction, setDirection] = useState('Buy');
  const [livePrice, setLivePrice] = useState(null);
  const [hasInitializedLivePrice, setHasInitializedLivePrice] = useState(false);

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
      setOpenPrice(livePrice);
      setClosePrice(livePrice);
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

    if (direction === 'Buy') {
      profit = (closePrice - openPrice) * contractSize * volume;
    } else {
      profit = (openPrice - closePrice) * contractSize * volume;
    }

    setResult({
      profit: parseFloat(profit.toFixed(2)),
      grossProfit: parseFloat(profit.toFixed(2)),
      fees: 0.0,
    });
  };

  const increment = (setter, value, step) => {
    setter(parseFloat((value + step).toFixed(4)));
  };

  const decrement = (setter, value, step, min = 0) => {
    const nextVal = value - step;
    if (nextVal >= min) setter(parseFloat(nextVal.toFixed(4)));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Side: Form */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Symbol */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 flex items-center gap-2 bg-white px-1 text-xs text-gray-500">
                Symbol
                {livePrice && (
                  <span className="text-green-500 font-medium flex items-center gap-1 ml-1" title="Live Market Price">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {livePrice.toFixed(5)}
                  </span>
                )}
              </label>
              <select 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 font-medium cursor-pointer appearance-none"
              >
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Open Price */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500 flex items-center gap-2">
                Open price
                {livePrice && (
                  <button 
                    onClick={() => setOpenPrice(livePrice)}
                    className="text-[10px] text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer"
                    title="Update to live price"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setOpenPrice, openPrice, 0.0001)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={openPrice}
                onChange={(e) => setOpenPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-center bg-transparent outline-none text-gray-900 font-medium"
              />
              <button onClick={() => increment(setOpenPrice, openPrice, 0.0001)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Account currency */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500">Account currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 font-medium cursor-pointer appearance-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Close Price */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500 flex items-center gap-2">
                Close price
                {livePrice && (
                  <button 
                    onClick={() => setClosePrice(livePrice)}
                    className="text-[10px] text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer"
                    title="Update to live price"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </label>
              <button onClick={() => decrement(setClosePrice, closePrice, 0.0001)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={closePrice}
                onChange={(e) => setClosePrice(parseFloat(e.target.value) || 0)}
                className="w-full text-center bg-transparent outline-none text-gray-900 font-medium"
              />
              <button onClick={() => increment(setClosePrice, closePrice, 0.0001)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Period in days */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500">Period in days</label>
              <button onClick={() => decrement(setDays, days, 1, 1)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={days}
                onChange={(e) => setDays(parseFloat(e.target.value) || 1)}
                className="w-full text-center bg-transparent outline-none text-gray-900 font-medium"
              />
              <button onClick={() => increment(setDays, days, 1)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="relative border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-blue-500 transition-colors">
              <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500">Volume, lots</label>
              <button onClick={() => decrement(setVolume, volume, 0.01, 0.01)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                value={volume}
                step="0.01"
                onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                className="w-full text-center bg-transparent outline-none text-gray-900 font-medium"
              />
              <button onClick={() => increment(setVolume, volume, 0.01)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Direction */}
            <div className="col-span-1 md:col-span-2 flex w-full">
              <button 
                onClick={() => setDirection('Sell')}
                className={`w-1/2 py-3 rounded-l-xl border text-sm font-medium transition-colors outline-none
                  ${direction === 'Sell' ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}
                `}
              >
                Sell
              </button>
              <button 
                onClick={() => setDirection('Buy')}
                className={`w-1/2 py-3 rounded-r-xl border-y border-r border-l-0 text-sm font-medium transition-colors outline-none
                  ${direction === 'Buy' ? 'border-green-400 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}
                `}
              >
                Buy
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:w-1/3 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-900 mb-6">Calculation results</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
              <span className="text-gray-900 font-semibold text-lg">Profit</span>
              <span className={`text-2xl font-bold ${result.profit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {result.profit < 0 ? '-' : ''}${Math.abs(result.profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 text-sm">Gross profit</span>
                <span className={`font-medium ${result.grossProfit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {result.grossProfit < 0 ? '-' : ''}${Math.abs(result.grossProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 text-sm">Trading fees</span>
                <span className="text-gray-500 font-medium">-${result.fees.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-8 flex justify-end">
        <button 
          onClick={handleCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-blue-100"
        >
          Calculate
        </button>
      </div>

    </div>
  );
};

export default Calculator;

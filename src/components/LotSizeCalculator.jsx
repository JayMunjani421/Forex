import { useState } from 'react';
import { Info } from 'lucide-react';

const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "EURGBP", "EURJPY", "GBPJPY", "EURCHF", "EURAUD", "EURNZD", "EURCAD", "GBPCHF", "GBPAUD", "GBPNZD", "GBPCAD", "CHFJPY", "AUDJPY", "AUDCHF", "AUDNZD", "AUDCAD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "XAGUSD", "XAUUSD", "UK100", "GER40", "NAS100", "USDMXN", "USDZAR"
];

const LotSizeCalculator = () => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [balance, setBalance] = useState('');
  const [risk, setRisk] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  
  const [result, setResult] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const handlePercentageChange = (val) => {
    let num = parseFloat(val);
    if (isNaN(num)) {
      setRisk(val);
      return;
    }
    if (num < 0) num = 0;
    if (num > 100) num = 100;
    setRisk(num.toString());
  };

  const handlePercentageBlur = () => {
    let num = parseFloat(risk);
    if (!isNaN(num)) {
      if (num < 0) num = 0;
      if (num > 100) num = 100;
      setRisk(num.toString());
    }
  };

  const handleCalculate = () => {
    const bal = parseFloat(balance) || 0;
    const rsk = parseFloat(risk) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;

    if (bal > 0 && rsk > 0 && entry > 0 && exit > 0 && Math.abs(entry - exit) > 0 && symbol) {
      const riskAmount = bal * (rsk / 100);
      const diff = Math.abs(entry - exit);
      
      const isJpy = symbol.includes('JPY');
      const isCryptoMetal = symbol.includes('XAU') || symbol.includes('XAG');
      const isIndex = symbol.includes('100') || symbol.includes('40');
      
      let pipMultiplier = 0.0001;
      let pipValue = 10;
      
      if (isJpy) {
        pipMultiplier = 0.01;
        pipValue = 10; // Approx default
      }
      if (isCryptoMetal || isIndex) {
        pipMultiplier = 0.01;
        pipValue = 1;
      }

      const pips = diff / pipMultiplier; 
      const lotsize = riskAmount / (pips * pipValue);
      setResult({
        lotSize: lotsize.toFixed(2),
        riskAmount: riskAmount.toFixed(2)
      });
      setHasCalculated(true);
    } else {
      setHasCalculated(true);
      setResult({
        lotSize: '0.00',
        riskAmount: '0.00'
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-12 border border-white/5 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
        
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Symbol */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Symbol
                <Info size={12} className="text-slate-400 hover:text-indigo-300 transition-colors cursor-help" title="Pick the asset you plan to trade." />
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

            {/* Account Balance */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Account Balance
                <Info size={12} className="text-slate-400 hover:text-indigo-300 transition-colors cursor-help" title="Enter the total funds currently available in your trading account." />
              </label>
              <input 
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-transparent border-none text-slate-100 font-semibold text-lg mt-1 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Risk Percentage */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Risk Percentage
                <Info size={12} className="text-slate-400 hover:text-indigo-300 transition-colors cursor-help" title="Specify what portion of your balance you're willing to risk on this trade." />
              </label>
              <input 
                type="number"
                placeholder="1 for 1%"
                value={risk}
                onChange={(e) => handlePercentageChange(e.target.value)}
                onBlur={handlePercentageBlur}
                min="0"
                max="100"
                className="w-full bg-transparent border-none text-slate-100 font-semibold text-lg mt-1 outline-none placeholder:text-slate-600"
              />
            </div>
            
            <div className="hidden md:block"></div>

            {/* Entry Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Entry Price
                <Info size={12} className="text-slate-400 hover:text-indigo-300 transition-colors cursor-help" title="Enter the price where you intend to open the trade." />
              </label>
              <input 
                type="number"
                placeholder="0.00000"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full bg-transparent border-none text-slate-100 font-semibold text-lg mt-1 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Exit Price */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 flex items-center gap-2 bg-[#0c1221] px-2 text-[11px] font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Exit Price
                <Info size={12} className="text-slate-400 hover:text-indigo-300 transition-colors cursor-help" title="Enter the price where you intend to close the trade." />
              </label>
              <input 
                type="number"
                placeholder="0.00000"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                className="w-full bg-transparent border-none text-slate-100 font-semibold text-lg mt-1 outline-none placeholder:text-slate-600"
              />
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
              <div className="flex flex-col items-end pb-6 border-b border-white/5 gap-2">
                <span className="text-slate-400 font-medium w-full text-left">Lot Size</span>
                <span 
                  className={`font-extrabold tracking-tight break-all text-right w-full ${!hasCalculated ? 'text-3xl text-slate-600' : 'text-4xl text-emerald-400'}`}
                >
                  {!hasCalculated ? '-' : result?.lotSize}
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col items-end group gap-1">
                  <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors w-full text-left">Amount at Risk</span>
                  <span className={`font-bold text-right w-full break-all ${!hasCalculated ? 'text-lg text-slate-600' : 'text-xl text-slate-200'}`}>
                    {!hasCalculated ? '-' : `$${result?.riskAmount}`}
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

export default LotSizeCalculator;

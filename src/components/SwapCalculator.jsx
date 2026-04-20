import { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Calendar } from 'lucide-react';

const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "EURGBP", "EURJPY", "GBPJPY", "EURCHF", "EURAUD", "EURNZD", "EURCAD", "GBPCHF", "GBPAUD", "GBPNZD", "GBPCAD", "CHFJPY", "AUDJPY", "AUDCHF", "AUDNZD", "AUDCAD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "XAGUSD", "XAUUSD", "UK100", "GER40", "NAS100", "USDMXN", "USDZAR"
];

const PLATFORMS = [
  { label: 'Match-Trader', value: 'match_trader' },
  { label: 'MT4 / MT5 / cTrader', value: 'mt' }
];

const SwapCalculator = () => {
  const [platform, setPlatform] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState('');
  const [volume, setVolume] = useState('');
  const [swapPoints, setSwapPoints] = useState('');

  // Dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // UI States
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isSymbolOpen, setIsSymbolOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date());
  const [selectionPhase, setSelectionPhase] = useState('start');

  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const [resultSwapFee, setResultSwapFee] = useState(0.0);

  // Dynamic positioning refs
  const datePickerRef = useRef(null);
  const [pickerPosition, setPickerPosition] = useState('bottom');

  // Format date helper for API (dd-mm-yyyy)
  const formatDateAPI = (d) => {
    if (!d) return '';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  // Format date helper for UI
  const formatDateUI = () => {
    if (!startDate && !endDate) return 'From → To';
    
    const startStr = startDate ? `${startDate.getDate().toString().padStart(2, '0')}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getFullYear()}` : 'From';
    const endStr = endDate ? `${endDate.getDate().toString().padStart(2, '0')}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getFullYear()}` : 'To';
    
    return `${startStr} → ${endStr}`;
  };

  // Fetch Swap Points
  useEffect(() => {
    const fetchSwapPoints = async () => {
      if (!symbol || !direction) {
        setSwapPoints('');
        return;
      }

      setIsLoadingPoints(true);
      try {
        const typeStr = direction.toLowerCase();
        const res = await fetch(`/api/swap-points?pair=${symbol}&trade_type=${typeStr}`, {
          method: 'GET',
          headers: {
            "accept": "application/json",
            "accept-language": "en-GB,en;q=0.9"
          }
        });
        const data = await res.json();
        
        let points = 0;
        if (data && data.data !== undefined) {
          points = data.data;
        } else if (data && data.swap_points !== undefined) {
          points = data.swap_points;
        } else if (data && data.points !== undefined) {
          points = data.points;
        }
        
        setSwapPoints(parseFloat(points) || 0);
      } catch (err) {
        console.error('Error fetching swap points:', err);
        setSwapPoints(0);
      }
      setIsLoadingPoints(false);
    };

    fetchSwapPoints();
  }, [symbol, direction]);

  const handleCalculate = async () => {
    if (!platform || !symbol || !direction || !volume || !startDate || !endDate) return;
    
    setIsCalculating(true);
    try {
      const payload = {
        pair: symbol,
        platform: platform.value,
        end_date: formatDateAPI(endDate),
        trade_type: direction.toLowerCase(),
        start_date: formatDateAPI(startDate),
        lot_size: Number(volume),
        swap_points: Number(swapPoints)
      };

      const resp = await fetch('/api/swap-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      
      let fee = 0;
      if (data && data.data !== undefined) {
        fee = data.data;
      } else if (data && data.swap_fee !== undefined) {
        fee = data.swap_fee;
      } else if (data && data.result !== undefined) {
        fee = data.result;
      }
      
      setResultSwapFee(parseFloat(fee) || 0);
      setHasCalculated(true);
    } catch (err) {
      console.error('Error calculating swap:', err);
      setResultSwapFee(0);
      setHasCalculated(true);
    }
    setIsCalculating(false);
  };

  // Calendar logic
  const getDaysInMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const calendarDays = getDaysInMonth(pickerMonth);

  const handleDayClick = (day) => {
    if (!day) return;
    
    if (selectionPhase === 'start') {
      setStartDate(day);
      setEndDate(null);
      setSelectionPhase('end');
    } else {
      if (day < startDate) {
        setStartDate(day);
      } else {
        setEndDate(day);
        setSelectionPhase('start');
        setIsDatePickerOpen(false);
      }
    }
  };

  const isSelected = (day) => {
    if (!day) return false;
    if (startDate && day.getTime() === startDate.getTime()) return true;
    if (endDate && day.getTime() === endDate.getTime()) return true;
    return false;
  };

  const isBetween = (day) => {
    if (!day || !startDate || !endDate) return false;
    return day > startDate && day < endDate;
  };



  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-12 border border-white/5 relative z-10">
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-[-1]">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-20">
        
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Platform Dropdown */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Platform
              </label>
              <div 
                className="w-full relative py-0.5"
                onClick={() => setIsPlatformOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className={`font-semibold text-[15px] ${!platform ? 'text-slate-400' : 'text-slate-100'}`}>
                    {platform ? platform.label : 'Select Platform'}
                  </span>
                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isPlatformOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsPlatformOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2 overflow-y-auto max-h-48">
                      {PLATFORMS.map(plat => (
                        <div 
                          key={plat.value} 
                          className={`px-3 py-2.5 rounded-lg cursor-pointer text-[15px] font-medium ${platform?.value === plat.value ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlatform(plat);
                            setIsPlatformOpen(false);
                          }}
                        >
                          {plat.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Instrument */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Instrument
              </label>
              <div 
                className="w-full relative py-0.5"
                onClick={() => setIsSymbolOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className={`font-semibold text-[15px] ${!symbol ? 'text-slate-400' : 'text-slate-100'}`}>
                    {symbol || 'Select Instrument'}
                  </span>
                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isSymbolOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsSymbolOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2">
                      <div className="relative mb-2">
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search instrument..."
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
                              setIsSymbolOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            {sym}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Trade Type Dropdown */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Trade Type
              </label>
              <div 
                className="w-full relative py-0.5"
                onClick={() => setIsDirectionOpen(true)}
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span className={`font-semibold text-[15px] ${!direction ? 'text-slate-400' : 'text-slate-100'}`}>
                    {direction || 'Select Trade Type'}
                  </span>
                  <svg className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {isDirectionOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsDirectionOpen(false); }}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-2 overflow-y-auto max-h-48">
                      {['Buy', 'Sell'].map(dir => (
                        <div 
                          key={dir} 
                          className={`px-3 py-2.5 rounded-lg cursor-pointer text-[15px] font-medium ${direction === dir ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDirection(dir);
                            setIsDirectionOpen(false);
                          }}
                        >
                          {dir}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Swap Points (Disabled API Fetch) */}
            <div className="relative border border-slate-700/60 bg-[#1a233a]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all shadow-inner opacity-70">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Swap Points
              </label>
              <div className="w-full bg-transparent outline-none py-0.5 cursor-not-allowed flex items-center min-h-[24px]">
                {isLoadingPoints ? (
                  <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full font-semibold text-slate-200"></div>
                ) : (
                  <span className={`font-semibold text-[15px] ${swapPoints === '' ? 'text-slate-500' : 'text-slate-200'} truncate`}>
                    {swapPoints === '' ? 'Swap Points' : swapPoints}
                  </span>
                )}
              </div>
            </div>

            {/* Lot Size */}
            <div className="relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 flex items-center justify-between focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">Lot Size</label>
              <input 
                type="number" 
                value={volume}
                step="0.01"
                placeholder="Enter Size"
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 font-semibold text-[15px] py-0.5 placeholder:text-slate-500"
              />
            </div>

            {/* Trade Period (Calendar Popup) */}
            <div 
              ref={datePickerRef}
              className={`relative border border-slate-700/60 bg-[#12192b]/80 rounded-2xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner ${isDatePickerOpen ? 'z-[60]' : ''}`}
            >
              <label className="absolute -top-3 left-4 bg-[#0c1221] px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 rounded-md">
                Trade Period
              </label>
              <div 
                className="w-full relative py-0.5 cursor-pointer flex items-center min-h-[24px]"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <span className={`text-sm sm:text-[15px] font-semibold truncate w-full ${!startDate && !endDate ? 'text-slate-500' : 'text-slate-200'}`}>
                  {formatDateUI()}
                </span>
              </div>
                
              {isDatePickerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsDatePickerOpen(false); }}></div>
                  <div 
                    className={`absolute left-0 ${pickerPosition === 'top' ? 'bottom-[calc(100%+8px)]' : 'top-full mt-2'} bg-[#12192b] border border-slate-700/60 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-4 w-[260px] sm:w-[280px] origin-top`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4 px-2">
                      <button 
                        onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1))}
                        className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                      >
                        &lt;
                      </button>
                      <span className="text-slate-100 font-semibold text-[15px]">
                        {pickerMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button 
                        onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1))}
                        className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                      >
                        &gt;
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-500 mb-2">
                      {'Su Mo Tu We Th Fr Sa'.split(' ').map(d => <div key={d}>{d}</div>)}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {calendarDays.map((d, i) => {
                        const selected = isSelected(d);
                        const inRange = isBetween(d);
                        
                        return (
                          <div 
                            key={i}
                            onClick={() => handleDayClick(d)}
                            className={`
                              py-1.5 rounded-md cursor-pointer transition-colors
                              ${!d ? '' : selected ? 'bg-indigo-500 text-white font-bold' : inRange ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-slate-700'}
                            `}
                          >
                            {d ? d.getDate() : ''}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

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
                <span className="text-slate-400 font-medium w-full text-left text-sm">Swap Fee</span>
                <span 
                  className={`font-extrabold tracking-tight break-all text-right w-full ${
                   !hasCalculated ? 'text-3xl text-slate-600' : 
                   resultSwapFee < 0 ? 'text-3xl text-rose-400' : 'text-3xl text-emerald-400'
                 }`}
                >
                 {!hasCalculated ? '-' : `${resultSwapFee < 0 ? '-' : ''}$${Math.abs(resultSwapFee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12 flex justify-end relative z-10">
        <button 
          onClick={handleCalculate}
          disabled={isCalculating || !platform || !symbol || !direction || !volume || !startDate || !endDate}
          className="w-full md:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] focus:ring-4 focus:ring-indigo-500/20 text-lg flex items-center justify-center gap-2 group"
        >
          {isCalculating ? 'Calculating...' : (
            <>
              Calculate
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default SwapCalculator;

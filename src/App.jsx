import { useState } from 'react';
import Calculator from './components/Calculator';
import LotSizeCalculator from './components/LotSizeCalculator';
import Charts from './components/Charts';
import News from './components/News';
import ForexInfo from './components/ForexInfo';

function App() {
  const [activeTab, setActiveTab] = useState('profit');

  return (
    <main className="min-h-screen bg-[#070b14] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-[#070b14] to-[#070b14] flex flex-col items-center p-4 py-8 lg:py-18">
      <div className="w-full max-w-6xl mx-auto space-y-10">
        
        {/* Header Text */}
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight drop-shadow-sm">
            {activeTab === 'profit' ? 'Real-Time Profit Calculator' : activeTab === 'lotsize' ? 'Lot Size Calculator' : 'Forex Calculators'}
          </h1>
          <p className="text-indigo-100/70 text-base md:text-lg font-light leading-relaxed">
            {activeTab === 'profit' 
              ? 'The profit calculator is a risk management tool to improve your trading of currency pairs and other assets. Calculate potential profits and losses of your orders and trade financial markets more confidently.'
              : activeTab === 'lotsize'
                ? 'The Lot Size Calculator helps you determine the ideal position size for your trades. It supports effective risk management by aligning your trade size with your overall strategy.'
                : 'Select the calculator you need from the options below to help manage your trades.'
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center w-full px-4 relative z-50 mb-2 mt-6">
          <div className="flex bg-[#0d1323]/50 p-2 border border-white/5 rounded-full backdrop-blur-md shadow-lg shadow-black/20 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full max-w-[calc(100vw-2rem)] md:w-auto md:flex-wrap md:justify-center">
            <button 
              onClick={() => setActiveTab('margin')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === 'margin' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Margin Calculator
            </button>
            <button 
              onClick={() => setActiveTab('profit')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === 'profit' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Profit/Loss Calculator
            </button>
            <button 
              onClick={() => setActiveTab('lotsize')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === 'lotsize' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Lot Size Calculator
            </button>
            <button 
              onClick={() => setActiveTab('swap')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${activeTab === 'swap' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Swap Calculator
            </button>
          </div>
        </div>

        {/* Calculator Widget */}
        <div className="px-2 md:px-0 relative z-10 w-full mt-4">
          {activeTab === 'profit' && <Calculator />}
          {activeTab === 'lotsize' && <LotSizeCalculator />}
          {activeTab !== 'profit' && activeTab !== 'lotsize' && (
            <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 border border-white/5 flex flex-col items-center justify-center min-h-100">
               <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                 <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-300 mb-2">Coming Soon</h3>
               <p className="text-slate-500 max-w-md text-center text-sm">This calculator is currently under development. Please check back later.</p>
            </div>
          )}
        </div>

        {/* Educational Info */}
        <div className="px-2 md:px-0 relative z-10 w-full">
          <ForexInfo />
        </div>

        {/* Live Charts */}
        <div className="px-2 md:px-0 relative z-10 w-full">
          <Charts />
        </div>

        {/* Live News */}
        <div className="px-2 md:px-0 relative z-10 w-full">
          <News />
        </div>
      </div>
    </main>
  );
}

export default App;

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
            {activeTab === 'profit' ? 'Real-Time Forex Profit Calculator' : activeTab === 'lotsize' ? 'Lot Size Calculator' : 'Forex Calculators'}
          </h1>
          <p className="text-indigo-100/70 text-base md:text-lg font-light leading-relaxed">
            {activeTab === 'profit' 
              ? 'The Forex profit calculator is a risk management tool to improve your trading of currency pairs and other assets. Calculate potential profits and losses of your orders and trade financial markets more confidently.'
              : activeTab === 'lotsize'
                ? 'Our Lot Size Calculator allows you to calculate the optimal Lot Size for your trades. This tool helps you manage risk effectively by determining position size that aligns with your trading plan for your trades.'
                : 'Select the calculator you need from the options below to help manage your trades.'
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 px-4 relative z-10 mb-2 mt-6">
          <div className="flex bg-[#0d1323]/50 p-2 border border-white/5 rounded-full backdrop-blur-md shadow-lg shadow-black/20 gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setActiveTab('margin')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'margin' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Margin Calculator
            </button>
            <button 
              onClick={() => setActiveTab('profit')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'profit' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Profit/Loss Calculator
            </button>
            <button 
              onClick={() => setActiveTab('lotsize')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'lotsize' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              Lot Size Calculator
            </button>
            <button 
              onClick={() => setActiveTab('swap')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'swap' ? 'bg-[#1e293b] border border-slate-600/50 shadow-md text-white' : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
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
            <div className="w-full max-w-5xl mx-auto bg-[#0d1323]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
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

        {/* Related Tools section */}
        <div className="flex justify-center pt-8 relative z-10">
          <button className="group relative px-8 py-3.5 rounded-full bg-slate-900/80 border border-slate-700/50 hover:border-indigo-500/50 text-slate-300 hover:text-white font-medium transition-all duration-300 shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Related Tools
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

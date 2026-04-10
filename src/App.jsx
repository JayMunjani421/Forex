import Calculator from './components/Calculator';

function App() {
  return (
    <main className="min-h-screen bg-[#070b14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#070b14] to-[#070b14] flex items-center justify-center p-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl mx-auto space-y-10">
        
        {/* Header Text */}
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight drop-shadow-sm">
            Real-Time Forex Profit Calculator
          </h1>
          <p className="text-indigo-100/70 text-base md:text-lg font-light leading-relaxed">
            The Forex profit calculator is a risk management tool to improve your trading of currency pairs and other assets. Calculate potential profits and losses of your orders and trade financial markets more confidently.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="px-2 md:px-0 relative z-10">
          <Calculator />
        </div>

        {/* Related Tools section */}
        <div className="flex justify-center pt-8 relative z-10">
          <button className="group relative px-8 py-3.5 rounded-full bg-slate-900/80 border border-slate-700/50 hover:border-indigo-500/50 text-slate-300 hover:text-white font-medium transition-all duration-300 shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Related Tools
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

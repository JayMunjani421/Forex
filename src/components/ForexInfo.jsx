import { TrendingUp, Globe, Briefcase } from 'lucide-react';

const ForexInfo = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-0">
      <div className="bg-linear-to-br from-[#12192b]/90 to-[#0c1221]/90 backdrop-blur-3xl border border-indigo-500/20 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Subtle background graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div
            id="kb-intro"
            className="scroll-mt-28 flex flex-col items-center text-center mb-10 lg:scroll-mt-32"
          >
            <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-3">Knowledge Base</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">How Does Forex Actually Work?</h2>
            <p className="text-slate-400 max-w-2xl text-lg">
              The Foreign Exchange (Forex) market is the largest and most liquid financial market in the world, where currencies are traded globally 24 hours a day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              id="kb-currency-pairs"
              className="scroll-mt-28 lg:scroll-mt-32 bg-[#1a233a] border border-white/5 p-6 rounded-2xl hover:bg-[#1e2a45] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Currency Pairs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Forex is always traded in pairs (like EUR/USD). The first currency is the <strong>base currency</strong>, and the second is the <strong>quote currency</strong>. You are essentially betting whether the base currency will rise or fall against the quote currency.
              </p>
            </div>

            {/* Card 2 */}
            <div
              id="kb-pips-spread"
              className="scroll-mt-28 lg:scroll-mt-32 bg-[#1a233a] border border-white/5 p-6 rounded-2xl hover:bg-[#1e2a45] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Pips & Spread</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A <strong>Pip</strong> (Percentage in Point) is the smallest price change a currency can make. The <strong>Spread</strong> is the difference between the Buy (Ask) and Sell (Bid) prices, representing the broker's immediate fee for facilitating your trade.
              </p>
            </div>

            {/* Card 3 */}
            <div
              id="kb-lots-leverage"
              className="scroll-mt-28 lg:scroll-mt-32 bg-[#1a233a] border border-white/5 p-6 rounded-2xl hover:bg-[#1e2a45] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Lots & Leverage</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Trades are placed in <strong>Lots</strong> (e.g., 1 Standard Lot = 100,000 units). Because currency movements are extremely small, traders use <strong>Leverage</strong> to control large positions with a small amount of capital, amplifying both profits and potential losses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexInfo;

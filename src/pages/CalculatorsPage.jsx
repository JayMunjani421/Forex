import { useState, useEffect, useRef } from 'react';
import Calculator from '../components/Calculator';
import LotSizeCalculator from '../components/LotSizeCalculator';
import MarginCalculator from '../components/MarginCalculator';
import SwapCalculator from '../components/SwapCalculator';
import PageHeading from '../components/PageHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const STORAGE_KEY = 'forex-calculator-active-tab';
const TABS = ['profit', 'margin', 'lotsize', 'swap'];

const titles = {
  profit: 'Profit / Loss',
  margin: 'Margin',
  lotsize: 'Lot size',
  swap: 'Swap',
};

const descriptions = {
  profit:
    'The profit calculator is a risk management tool to improve your trading of currency pairs and other assets. Calculate potential profits and losses of your orders and trade financial markets more confidently.',
  lotsize:
    'The Lot Size Calculator helps you determine the ideal position size for your trades. It supports effective risk management by aligning your trade size with your overall strategy.',
  margin:
    'Our Margin Calculator allows you to calculate the margin required for your trades. This tool helps you estimate the capital needed to open a position, supporting better planning and risk management.',
  swap:
    'Use the Swap Calculator to accurately estimate overnight swap fees and better understand the cost of holding trades longer. Manage your rollover costs effectively and efficiently with greater precision and control.',
};

function readStoredTab() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && TABS.includes(raw)) return raw;
  } catch {
    /* ignore */
  }
  return 'profit';
}

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState(readStoredTab);
  const calculatorAnchor = useRef(null);

  useDocumentTitle(`Forex Tools — ${titles[activeTab]} calculator`);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeTab);
    } catch {
      /* ignore */
    }
  }, [activeTab]);

  const selectTab = (tab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      calculatorAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-10">
        <div className="mx-auto max-w-3xl space-y-4 px-4 text-center">
          <PageHeading>
            {activeTab === 'profit' && 'Real-Time Profit Calculator'}
            {activeTab === 'lotsize' && 'Lot Size Calculator'}
            {activeTab === 'margin' && 'Margin Calculator'}
            {activeTab === 'swap' && 'Swap Calculator'}
          </PageHeading>
          <p className="text-base font-light leading-relaxed text-indigo-100/70 md:text-lg">
            {descriptions[activeTab]}
          </p>
        </div>

        <div className="relative z-50 mb-2 mt-4 flex w-full justify-center px-4">
          <div className="flex w-full max-w-[calc(100vw-2rem)] gap-2 overflow-x-auto rounded-full border border-white/5 bg-[#0d1323]/50 p-2 shadow-lg shadow-black/20 backdrop-blur-md [scrollbar-width:none] md:w-auto md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => selectTab('profit')}
              className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                activeTab === 'profit'
                  ? 'border border-slate-600/50 bg-[#1e293b] text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              Profit/Loss Calculator
            </button>
            <button
              type="button"
              onClick={() => selectTab('margin')}
              className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                activeTab === 'margin'
                  ? 'border border-slate-600/50 bg-[#1e293b] text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              Margin Calculator
            </button>
            <button
              type="button"
              onClick={() => selectTab('lotsize')}
              className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                activeTab === 'lotsize'
                  ? 'border border-slate-600/50 bg-[#1e293b] text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              Lot Size Calculator
            </button>
            <button
              type="button"
              onClick={() => selectTab('swap')}
              className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                activeTab === 'swap'
                  ? 'border border-slate-600/50 bg-[#1e293b] text-white shadow-md'
                  : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              Swap Calculator
            </button>
          </div>
        </div>

        <div ref={calculatorAnchor} className="scroll-mt-28 px-2 md:px-0">
          {activeTab === 'profit' && <Calculator />}
          {activeTab === 'lotsize' && <LotSizeCalculator />}
          {activeTab === 'margin' && <MarginCalculator />}
          {activeTab === 'swap' && <SwapCalculator />}
        </div>
      </div>
    </main>
  );
}

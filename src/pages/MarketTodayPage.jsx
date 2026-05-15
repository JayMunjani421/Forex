import PageHeading from '../components/PageHeading';
import SectionErrorBoundary from '../components/SectionErrorBoundary';
import SupportedBrokers from '../components/marketToday/SupportedBrokers';
import PerpetualFuturesTable from '../components/marketToday/PerpetualFuturesTable';
import GlobalMarkets from '../components/marketToday/GlobalMarkets';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function MarketTodayPage() {
  useDocumentTitle('Forex Tools — Market Today');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-8">
        <div className="mx-auto max-w-3xl space-y-3 px-2 text-center md:px-0">
          <PageHeading>Market Today</PageHeading>
          <p className="text-lg font-light leading-relaxed text-indigo-100/70">
            Live perpetual futures by category, supported brokers and global index snapshots updated from market data, so you can scan movers, funding, and regional benchmarks in one place.
          </p>
        </div>

        <SectionErrorBoundary
          title="Futures table hit an error"
          description="If this persists, try refreshing the page."
        >
          <PerpetualFuturesTable />
        </SectionErrorBoundary>

        <SectionErrorBoundary
          title="Global markets hit an error"
          description="If this persists, try refreshing the page."
        >
          <div className="rounded-3xl border border-white/5 bg-[#0d1323]/70 p-6 backdrop-blur-xl md:p-8">
            <GlobalMarkets />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary
          title="Brokers section hit an error"
          description="If this persists, try refreshing the page."
        >
          <SupportedBrokers />
        </SectionErrorBoundary>

      </div>
    </main>
  );
}

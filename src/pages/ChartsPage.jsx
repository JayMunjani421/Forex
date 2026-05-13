import Charts from '../components/Charts';
import PageHeading from '../components/PageHeading';
import SectionErrorBoundary from '../components/SectionErrorBoundary';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ChartsPage() {
  useDocumentTitle('Forex Tools — Charts');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-6">
        <div className="mx-auto max-w-3xl space-y-3 px-2 text-center md:px-0">
          <PageHeading>Market charts</PageHeading>
          <p className="text-lg font-light leading-relaxed text-indigo-100/70">
            Hourly candles from public exchange data. For illustration only; not a live trading terminal.
          </p>
        </div>
        <SectionErrorBoundary
          title="Charts could not load"
          description="The data provider may be unreachable. You can try again in a few seconds."
        >
          <Charts />
        </SectionErrorBoundary>
      </div>
    </main>
  );
}

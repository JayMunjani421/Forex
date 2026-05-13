import News from '../components/News';
import PageHeading from '../components/PageHeading';
import SectionErrorBoundary from '../components/SectionErrorBoundary';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NewsPage() {
  useDocumentTitle('Forex Tools — News');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-6">
        <div className="mx-auto max-w-3xl space-y-3 px-2 text-center md:px-0">
          <PageHeading>Market news</PageHeading>
          <p className="text-lg font-light leading-relaxed text-indigo-100/70">
            Headlines syndicated from a third-party RSS feed. Open articles in a new tab to read the full story.
          </p>
        </div>
        <SectionErrorBoundary
          title="News section hit an error"
          description="If this persists, try refreshing the page."
        >
          <News />
        </SectionErrorBoundary>
      </div>
    </main>
  );
}

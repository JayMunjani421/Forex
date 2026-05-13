import ForexInfo from '../components/ForexInfo';
import PageHeading from '../components/PageHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function LearnPage() {
  useDocumentTitle('Forex Tools — Learn');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center px-4 py-8 lg:py-12">
      <div className="w-full max-w-6xl space-y-8">
        <div className="mx-auto max-w-3xl space-y-3 px-2 text-center md:px-0">
          <PageHeading>Learn forex fundamentals</PageHeading>
          <p className="text-lg font-light leading-relaxed text-indigo-100/70">
            Short, practical explanations you can skim before using the calculators.
          </p>
        </div>
        <ForexInfo />
      </div>
    </main>
  );
}

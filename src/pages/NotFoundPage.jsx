import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Forex Tools — Page not found');

  return (
    <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">404</p>
        <div className="mt-2">
          <PageHeading>Page not found</PageHeading>
        </div>
        <p className="mt-3 text-lg font-light leading-relaxed text-indigo-100/70">That URL does not match any section of this app.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

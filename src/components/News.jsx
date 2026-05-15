import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async (isManual) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await fetch(RSS_URL);
      if (!res.ok) {
        throw new Error(`News request failed (${res.status})`);
      }
      const data = await res.json();
      if (data.status === 'error' && data.message) {
        throw new Error(data.message);
      }
      const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];
      setNews(items);
      setLastUpdated(new Date());
      if (items.length === 0) {
        setError('No headlines were returned. The feed may be empty or temporarily unavailable.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Could not load news.');
      setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex justify-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-indigo-500/20 rounded w-24" />
        </div>
        <span className="sr-only">Loading news</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="mb-8 flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-0">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-100">Live Market News</h2>
        </div>
        
      </div>

      {error && (
        <div className="mx-4 mb-8 rounded-2xl border border-amber-500/25 bg-amber-950/25 p-4 text-sm text-amber-100/90 md:mx-0">
          {error}
        </div>
      )}

      {news.length === 0 && !error && (
        <p className="px-4 text-center text-slate-500 md:px-0">No articles to show right now.</p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, idx) => {
          let timeAgo = '';
          try {
            timeAgo = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true });
          } catch {
            timeAgo = item.pubDate;
          }

          const strippedDesc = item.description
            ? `${item.description.replace(/(<([^>]+)>)/gi, '').substring(0, 100)}...`
            : '';

          return (
            <a
              key={item.guid || item.link || idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-3xl border border-slate-700/60 bg-[#12192b]/80 p-6 shadow-lg backdrop-blur-2xl transition hover:border-indigo-500/30 hover:shadow-indigo-500/10"
            >
              <div className="flex-1">
                <h4 className="mb-3 text-lg font-bold leading-snug text-slate-200 transition group-hover:text-indigo-400">
                  {item.title}
                </h4>
                <p className="mb-4 line-clamp-3 text-sm text-slate-400">{strippedDesc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 transition group-hover:translate-x-1">
                  Read more
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default News;

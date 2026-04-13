import { useState, useEffect } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Using rss2json to convert ForexLive RSS feed
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news');
        const data = await res.json();
        if (data.items) {
          // Keep top 6 news items
          setNews(data.items.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-indigo-500/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-12">
      <div className="flex items-center gap-3 mb-8 px-4 md:px-0">
        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-100">Live Market News</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, idx) => {
          // Parse pubDate safely
          let timeAgo = '';
          try {
            // Replace space with T for proper iso format handling in some browsers if needed, or date-fns handles it
            timeAgo = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true });
          } catch(e) {
            timeAgo = item.pubDate;
          }

          // Strip HTML tags from description
          const strippedDesc = item.description ? item.description.replace(/(<([^>]+)>)/gi, "").substring(0, 100) + '...' : '';

          return (
            <a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#12192b]/80 backdrop-blur-2xl border border-slate-700/60 p-6 rounded-3xl shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all group flex flex-col h-full"
            >
              <div className="flex-1">
                <h4 className="text-slate-200 font-bold text-lg mb-3 leading-snug group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {strippedDesc}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold mt-4 pt-4 border-t border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Read more
                  <ExternalLink className="w-3.5 h-3.5" />
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

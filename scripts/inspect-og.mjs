import { XMLParser } from 'fast-xml-parser';

async function inspect(feedUrl, name) {
  const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(await res.text());
  const item = doc.rss.channel.item[0];
  const link = item.link;
  const rssDesc = item.description || '';
  console.log('\n===', name, '===');
  console.log('rss desc len', String(rssDesc).length);

  const page = await fetch(link, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const html = await page.text();
  function meta(prop) {
    const m1 = html.match(new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'));
    const m2 = html.match(new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i'));
    return (m1 || m2)?.[1];
  }
  console.log('og:image', meta('og:image'));

  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd[1]);
      const article = Array.isArray(data) ? data.find((d) => d['@type'] === 'NewsArticle' || d['@type'] === 'Article') : data;
      console.log('jsonld type', article?.['@type'], 'body len', article?.articleBody?.length);
      console.log('jsonld image', article?.image);
    } catch (e) {
      console.log('jsonld parse fail');
    }
  }

  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  console.log('article tag len', articleMatch?.[0]?.length || 0);
}

await inspect('https://www.fxstreet.com/rss/news', 'FXStreet');
await inspect('https://www.forexlive.com/feed/news', 'ForexLive');

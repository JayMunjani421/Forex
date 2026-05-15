import { XMLParser } from 'fast-xml-parser';

const feeds = [
  'https://www.forexlive.com/feed/news',
  'https://www.fxstreet.com/rss/news',
];

for (const url of feeds) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const xml = await res.text();
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(xml);
  const items = doc.rss?.channel?.item || [];
  const item = items[0];
  console.log('---', url);
  console.log('keys', Object.keys(item || {}));
  const desc = item?.description || item?.['content:encoded'] || '';
  console.log('desc sample', String(desc).slice(0, 300));
  const re = /<img[^>]+src=["']([^"']+)["']/i;
  console.log('img', String(desc).match(re)?.[1]);
}

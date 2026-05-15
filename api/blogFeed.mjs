import { XMLParser } from 'fast-xml-parser';
import {
  fetchArticlePage,
  mapPool,
  splitParagraphs,
  stripHtml,
} from './articleEnricher.mjs';

const FEEDS = [
  { name: 'ForexLive', url: 'https://www.forexlive.com/feed/news' },
  { name: 'FXStreet', url: 'https://www.fxstreet.com/rss/news' },
];

const CACHE_MS = 60 * 60 * 1000;
let cache = { at: 0, posts: [] };

const SYNONYMS = [
  ['said', 'noted'],
  ['says', 'notes'],
  ['rise', 'climb'],
  ['rises', 'climbs'],
  ['fall', 'drop'],
  ['falls', 'drops'],
  ['higher', 'firmer'],
  ['lower', 'weaker'],
  ['market', 'marketplace'],
  ['traders', 'participants'],
  ['investors', 'market participants'],
  ['expected', 'anticipated'],
  ['because', 'as'],
  ['however', 'yet'],
  ['increased', 'moved up'],
  ['decreased', 'moved down'],
  ['volatility', 'price swings'],
  ['central bank', 'policy authority'],
  ['inflation', 'price pressures'],
  ['dollar', 'US currency'],
  ['euro', 'shared currency'],
  ['pound', 'sterling'],
  ['yen', 'Japanese currency'],
];

function applySynonyms(text) {
  let out = text;
  for (const [from, to] of SYNONYMS) {
    out = out.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
  }
  return out;
}

function hashLink(link) {
  let h = 0;
  for (let i = 0; i < link.length; i++) h = (h << 5) - h + link.charCodeAt(i);
  return Math.abs(h).toString(36).slice(0, 6);
}

export function createSlug(title, link) {
  const base = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 55);
  return `${base}-${hashLink(link)}`;
}

function extractImageFromHtml(html = '') {
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? match[1].replace(/&amp;/g, '&') : null;
}

export function transformContent(rawText, source) {
  const paragraphs = splitParagraphs(stripHtml(rawText)).slice(0, 20);
  const rewritten = paragraphs.map((p) => applySynonyms(p));

  const summary = rewritten[0] || `Market update from ${source}.`;

  return {
    intro: `Plain-language market briefing based on public reporting from ${source}. Wording has been adapted for clarity on Forex Tools.`,
    summary,
    bodyParagraphs: rewritten,
    excerpt: summary.slice(0, 220) + (summary.length > 220 ? '…' : ''),
    disclaimer:
      'Educational content for traders. Summaries are adapted from publicly available headlines; verify facts before trading.',
  };
}

function normalizeItem(item, source) {
  const link = item.link?.['#text'] || item.link || item.guid || '';
  if (!link || !item.title) return null;

  const pubRaw = item.pubDate || item.published || item.updated || item['dc:date'];
  const pubDate = pubRaw ? new Date(pubRaw) : new Date();
  if (Number.isNaN(pubDate.getTime())) return null;

  const title = typeof item.title === 'string' ? item.title : item.title?.['#text'] || '';
  const rawHtml = item['content:encoded'] || item.description || item.summary || '';
  const slug = createSlug(title, link);
  const rssImage = extractImageFromHtml(rawHtml);
  const transformed = transformContent(rawHtml, source);

  return {
    slug,
    title: stripHtml(title),
    source,
    sourceUrl: link,
    publishedAt: pubDate.toISOString(),
    rawHtml,
    image: rssImage,
    ...transformed,
  };
}

async function enrichImage(post) {
  if (post.image) return post;
  try {
    const meta = await fetchArticlePage(post.sourceUrl, { fullBody: false });
    if (meta?.image) return { ...post, image: meta.image };
  } catch {
    /* ignore */
  }
  return post;
}

async function enrichFull(post) {
  let next = await enrichImage(post);

  if (next.bodyParagraphs?.length >= 4 && next.bodyParagraphs.join('').length > 600) {
    return next;
  }

  try {
    const page = await fetchArticlePage(post.sourceUrl, { fullBody: true });
    const mergedHtml = page?.bodyText?.length > stripHtml(post.rawHtml).length ? page.bodyText : post.rawHtml;
    const transformed = transformContent(mergedHtml || post.rawHtml, post.source);
    next = {
      ...next,
      image: next.image || page?.image || null,
      ...transformed,
    };
  } catch {
    /* keep RSS content */
  }

  return next;
}

async function parseFeed(feed) {
  const res = await fetch(feed.url, {
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
      'User-Agent': 'ForexToolsBlogBot/1.0',
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`${feed.name} feed ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const doc = parser.parse(xml);
  const channel = doc?.rss?.channel || doc?.feed;
  if (!channel) return [];

  const rawItems = channel.item || channel.entry || [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];
  return items.map((item) => normalizeItem(item, feed.name)).filter(Boolean);
}

export async function getBlogPosts({ slug, full = false } = {}) {
  const now = Date.now();
  if (!cache.posts.length || now - cache.at > CACHE_MS) {
    const batches = await Promise.allSettled(FEEDS.map(parseFeed));
    const merged = [];
    const seen = new Set();
    for (const batch of batches) {
      if (batch.status !== 'fulfilled') continue;
      for (const post of batch.value) {
        if (seen.has(post.sourceUrl)) continue;
        seen.add(post.sourceUrl);
        merged.push(post);
      }
    }
    merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const withImages = await mapPool(merged.slice(0, 45), enrichImage, 6);
    const rest = merged.slice(45);
    cache = { at: now, posts: [...withImages, ...rest] };
  }

  if (slug) {
    let post = cache.posts.find((p) => p.slug === slug);
    if (!post) return null;
    if (full) post = await enrichFull(post);
    const { rawHtml, ...safe } = post;
    return safe;
  }

  return cache.posts.map(({ rawHtml, ...safe }) => safe);
}

export function pickDailyPosts(posts, max = 5) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);

  const today = posts.filter((p) => new Date(p.publishedAt) >= startOfToday);
  const yesterday = posts.filter((p) => {
    const d = new Date(p.publishedAt);
    return d >= startOfYesterday && d < startOfToday;
  });

  const picked = [...today];
  if (picked.length < 3) {
    picked.push(...yesterday.slice(0, max - picked.length));
  }
  return picked.slice(0, max);
}

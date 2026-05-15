function decodeEntities(str = '') {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function stripHtml(html = '') {
  return decodeEntities(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

function extractMeta(html, prop) {
  const re1 = new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i');
  const re3 = new RegExp(`name=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i');
  return decodeEntities((html.match(re1) || html.match(re2) || html.match(re3))?.[1] || '');
}

function extractArticleHtml(html) {
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  if (article && stripHtml(article).length > 120) return article;

  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (main && stripHtml(main).length > 120) return main;

  return '';
}

function paragraphsFromHtml(html = '') {
  const matches = [...String(html).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const paras = matches
    .map((m) => stripHtml(m[1]))
    .filter(
      (p) =>
        p.length > 50 &&
        !/^news\s*\|/i.test(p) &&
        !/cookie|subscribe|advertisement|artificial intelligence tool|insights team/i.test(p),
    );
  if (paras.length >= 2) return paras;
  return [];
}

export function splitParagraphs(text) {
  const chunks = String(text)
    .split(/\n{2,}/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+(?=[A-Z])/))
    .map((p) => p.trim())
    .filter((p) => p.length > 55 && !/^news\s*\|/i.test(p));
  return chunks.length ? chunks : text.trim() ? [text.trim()] : [];
}

export async function fetchArticlePage(url, { fullBody = false } = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(fullBody ? 14000 : 9000),
    redirect: 'follow',
  });

  if (!res.ok) return null;
  const html = await res.text();

  let image =
    extractMeta(html, 'og:image') ||
    extractMeta(html, 'twitter:image') ||
    extractMeta(html, 'twitter:image:src');

  if (image && image.startsWith('/')) {
    try {
      image = new URL(image, url).href;
    } catch {
      image = '';
    }
  }

  if (!fullBody) {
    return { image: image || null, bodyText: '', paragraphs: [] };
  }

  const articleHtml = extractArticleHtml(html);
  let paragraphs = paragraphsFromHtml(articleHtml);
  let bodyText = stripHtml(articleHtml);

  if (paragraphs.length < 2) {
    if (bodyText.length < 200) {
      const ogDesc = extractMeta(html, 'og:description');
      if (ogDesc.length > bodyText.length) bodyText = ogDesc;
    }
    paragraphs = splitParagraphs(bodyText);
  } else {
    bodyText = paragraphs.join('\n\n');
  }
  return {
    image: image || null,
    bodyText,
    paragraphs,
  };
}

export async function mapPool(items, mapper, concurrency = 5) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await mapper(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

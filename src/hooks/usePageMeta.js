import { useEffect } from 'react';

const SITE_NAME = 'Forex Tools';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * @param {{
 *   title?: string;
 *   description?: string;
 *   image?: string;
 *   canonicalPath?: string;
 *   type?: 'website' | 'article';
 *   publishedTime?: string;
 *   jsonLd?: object;
 * }} options
 */
export function usePageMeta({
  title,
  description,
  image,
  canonicalPath,
  type = 'website',
  publishedTime,
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const origin = window.location.origin;
    const canonical = canonicalPath ? `${origin}${canonicalPath}` : window.location.href;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertLink('canonical', canonical);

    if (type === 'article' && publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime);
    }

    if (jsonLd) {
      upsertJsonLd('page-jsonld', jsonLd);
    }

    return () => {
      const json = document.getElementById('page-jsonld');
      if (json) json.remove();
    };
  }, [title, description, image, canonicalPath, type, publishedTime, jsonLd ? JSON.stringify(jsonLd) : '']);
}

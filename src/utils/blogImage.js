export function blogImageSrc(url) {
  if (!url) return null;
  return `/api/blog-image?url=${encodeURIComponent(url)}`;
}

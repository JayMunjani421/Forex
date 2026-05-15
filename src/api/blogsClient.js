export async function fetchBlogList() {
  const res = await fetch('/api/blogs');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Blog request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchBlogPost(slug) {
  const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Blog request failed (${res.status})`);
  }
  const data = await res.json();
  return data.post;
}

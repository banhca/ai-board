import { CORS } from '../config/constants';
import { autoTag, AI_RE } from '../utils/autoTag';

async function fetchHN() {
  try {
    const ids = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());
    const items = await Promise.all(
      ids.slice(0, 120).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()).catch(() => null)
      )
    );
    return items
      .filter(s => s && s.title && AI_RE.test(s.title) && s.url)
      .map(s => ({
        id: `hn_${s.id}`, title: s.title, url: s.url, source: 'hn', excerpt: '',
        tags: autoTag(s.title, ''),
        publishedAt: new Date(s.time * 1000).toISOString(),
        fetchedAt: Date.now(), score: s.score || 0, author: s.by || '',
        comments: s.descendants || 0, imageUrl: null,
      }));
  } catch (e) { console.warn('HN:', e); return []; }
}

async function fetchReddit(sub, srcId) {
  try {
    const url = `https://www.reddit.com/r/${sub}/top.json?t=day&limit=25&raw_json=1`;
    const data = await fetch(CORS(url)).then(r => r.json());
    return (data?.data?.children || [])
      .filter(p => p?.data?.title)
      .map(p => {
        const d = p.data;
        return {
          id: `${srcId}_${d.id}`, title: d.title,
          url: d.url || `https://reddit.com${d.permalink}`,
          source: srcId, excerpt: d.selftext ? d.selftext.slice(0, 300) : '',
          tags: autoTag(d.title, d.selftext || ''),
          publishedAt: new Date(d.created_utc * 1000).toISOString(),
          fetchedAt: Date.now(), score: d.score || 0, author: `u/${d.author || '?'}`,
          comments: d.num_comments || 0,
          imageUrl: (d.thumbnail && d.thumbnail.startsWith('http') && !d.thumbnail.includes('default') && !d.thumbnail.includes('self')) ? d.thumbnail : null,
        };
      });
  } catch (e) { console.warn(`Reddit r/${sub}:`, e); return []; }
}

async function fetchDevTo() {
  try {
    const arts = await fetch('https://dev.to/api/articles?tag=ai&per_page=30&top=7').then(r => r.json());
    return arts.filter(a => a?.title).map(a => ({
      id: `devto_${a.id}`, title: a.title, url: a.url, source: 'devto',
      excerpt: a.description || '',
      tags: autoTag(a.title, a.description || ''),
      publishedAt: a.published_at, fetchedAt: Date.now(),
      score: a.positive_reactions_count || 0, author: a.user?.name || '',
      comments: a.comments_count || 0, imageUrl: a.cover_image || null,
    }));
  } catch (e) { console.warn('Dev.to:', e); return []; }
}

async function fetchRSS(rssUrl, srcId, aiFilter = false) {
  try {
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=25`;
    const data = await fetch(api).then(r => r.json());
    if (data.status !== 'ok') return [];
    let items = data.items || [];
    if (aiFilter) items = items.filter(i => AI_RE.test(i.title || '') || AI_RE.test(i.description || ''));
    return items.filter(i => i?.title && i?.link).map((i, idx) => ({
      id: `${srcId}_${btoa(i.link).slice(0, 10)}_${idx}`,
      title: i.title, url: i.link, source: srcId,
      excerpt: i.description ? i.description.replace(/<[^>]+>/g, '').trim().slice(0, 300) : '',
      tags: autoTag(i.title, i.description || ''),
      publishedAt: i.pubDate, fetchedAt: Date.now(),
      score: 0, author: i.author || '', comments: 0,
      imageUrl: i.thumbnail && i.thumbnail.startsWith('http') ? i.thumbnail : null,
    }));
  } catch (e) { console.warn(`RSS ${srcId}:`, e); return []; }
}

export async function fetchAll() {
  const results = await Promise.allSettled([
    fetchHN(),
    fetchReddit('artificial',      'reddit_ai'),
    fetchReddit('LocalLLaMA',      'reddit_llm'),
    fetchReddit('MachineLearning', 'reddit_ml'),
    fetchReddit('ChatGPT',         'reddit_gpt'),
    fetchDevTo(),
    fetchRSS('https://www.producthunt.com/feed',        'producthunt', true),
    fetchRSS('https://openai.com/blog/rss.xml',         'openai'),
    fetchRSS('https://www.anthropic.com/rss.xml',       'anthropic'),
    fetchRSS('https://huggingface.co/blog/feed.xml',    'huggingface'),
  ]);
  const all = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  const seen = new Set();
  return all
    .filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true; })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export const REFRESH_OPTIONS = [
  { label: '1h',  ms: 1 * 60 * 60 * 1000 },
  { label: '6h',  ms: 6 * 60 * 60 * 1000 },
  { label: '12h', ms: 12 * 60 * 60 * 1000 },
];

export const EXPIRY_7D = 7 * 24 * 60 * 60 * 1000;

export const CORS = url => `https://corsproxy.io/?${encodeURIComponent(url)}`;

export const ROLES = [
  { id: 'developer', icon: '👨‍💻', label: 'Developer',         desc: 'Software engineers, backend/frontend/fullstack', tags: ['Development','LLM','Open Source','Automation','AI Tools'] },
  { id: 'tester',    icon: '🧪',  label: 'Tester / QA',        desc: 'QA engineers, test automation specialists',       tags: ['Testing','Automation','AI Tools','Development'] },
  { id: 'data',      icon: '📊',  label: 'Data Analyst',       desc: 'Data analysts, ML engineers, data scientists',    tags: ['Data','Research','LLM','AI Tools','Open Source'] },
  { id: 'business',  icon: '📈',  label: 'Business & Product', desc: 'BA, PO, PM — strategy & product management',      tags: ['Business','AI Tools','AI Policy','LLM','Research'] },
];

export const GOALS = [
  'Find AI tools to apply at work',
  'Follow AI news & market trends',
  'Track trending topics',
  'Research new models & papers',
  'Find tools to boost team productivity',
];

export const ALL_TAGS = [
  'LLM', 'AI Tools', 'Development', 'Testing', 'Data',
  'Research', 'Business', 'Automation', 'AI Policy', 'Open Source',
];

// Individual source config: srcId → display metadata
export const SOURCES = {
  hn:          { group: 'hn',          label: 'Hacker News',       thread: null,                color: '#f97316', bg: 'rgba(249,115,22,0.18)'  },
  reddit_ai:   { group: 'reddit',      label: 'r/artificial',      thread: 'r/artificial',      color: '#ef4444', bg: 'rgba(239,68,68,0.18)'   },
  reddit_llm:  { group: 'reddit',      label: 'r/LocalLLaMA',      thread: 'r/LocalLLaMA',      color: '#ef4444', bg: 'rgba(239,68,68,0.18)'   },
  reddit_ml:   { group: 'reddit',      label: 'r/MachineLearning', thread: 'r/MachineLearning', color: '#ef4444', bg: 'rgba(239,68,68,0.18)'   },
  reddit_gpt:  { group: 'reddit',      label: 'r/ChatGPT',         thread: 'r/ChatGPT',         color: '#ef4444', bg: 'rgba(239,68,68,0.18)'   },
  devto:       { group: 'devto',       label: 'Dev.to',            thread: null,                color: '#a855f7', bg: 'rgba(168,85,247,0.18)'  },
  producthunt: { group: 'producthunt', label: 'Product Hunt',      thread: null,                color: '#da552f', bg: 'rgba(218,85,47,0.18)'   },
  openai:      { group: 'openai',      label: 'OpenAI Blog',       thread: null,                color: '#10b981', bg: 'rgba(16,185,129,0.18)'  },
  anthropic:   { group: 'anthropic',   label: 'Anthropic Blog',    thread: null,                color: '#6366f1', bg: 'rgba(99,102,241,0.18)'  },
  huggingface: { group: 'huggingface', label: 'HuggingFace Blog',  thread: null,                color: '#eab308', bg: 'rgba(234,179,8,0.18)'   },
};

// Website groups for the filter bar
export const SOURCE_GROUPS = {
  hn:          { label: 'Hacker News',  color: '#f97316', bg: 'rgba(249,115,22,0.18)'  },
  reddit:      { label: 'Reddit',       color: '#ef4444', bg: 'rgba(239,68,68,0.18)'   },
  devto:       { label: 'Dev.to',       color: '#a855f7', bg: 'rgba(168,85,247,0.18)'  },
  producthunt: { label: 'Product Hunt', color: '#da552f', bg: 'rgba(218,85,47,0.18)'   },
  openai:      { label: 'OpenAI',       color: '#10b981', bg: 'rgba(16,185,129,0.18)'  },
  anthropic:   { label: 'Anthropic',    color: '#6366f1', bg: 'rgba(99,102,241,0.18)'  },
  huggingface: { label: 'HuggingFace',  color: '#eab308', bg: 'rgba(234,179,8,0.18)'   },
};

export const getGroup = srcId => SOURCES[srcId]?.group || srcId;

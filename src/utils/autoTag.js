export const AI_RE = /ai\b|artificial intelligence|llm|gpt|claude|gemini|openai|anthropic|machine learning|\bml\b|neural|chatgpt|llama|mistral|deepseek|agent\b|langchain|rag\b|embedding|hugging/i;

export function autoTag(title = '', excerpt = '') {
  const t = (title + ' ' + excerpt).toLowerCase();
  const out = [];
  if (/gpt|claude|gemini|llm|llama|mistral|deepseek|qwen|phi|mixtral|language model|chatgpt|groq/.test(t))       out.push('LLM');
  if (/\btool\b|plugin|extension|launch|product hunt|release|v\d+\.|update|app\b/.test(t))                        out.push('AI Tools');
  if (/\bcode\b|coding|developer|api\b|sdk\b|github|library|framework|programming|engineer/.test(t))              out.push('Development');
  if (/\btest\b|testing|qa\b|quality assurance|bug|debug|coverage|e2e/.test(t))                                   out.push('Testing');
  if (/\bdata\b|dataset|analytics|visualization|sql|pandas|spark|bigquery|warehouse/.test(t))                     out.push('Data');
  if (/research|paper|study|experiment|benchmark|arxiv|preprint|publish/.test(t))                                 out.push('Research');
  if (/business|startup|funding|revenue|market|enterprise|investor|series [a-c]/.test(t))                         out.push('Business');
  if (/automat|workflow|agent|pipeline|no.code|zapier|n8n|orchestrat/.test(t))                                    out.push('Automation');
  if (/safety|ethic|policy|regulation|law|gdpr|bias|risk|govern|copyright/.test(t))                               out.push('AI Policy');
  if (/open.source|open source|hugging face|huggingface|\blocal\b|self.host|ollama|open.weight/.test(t))          out.push('Open Source');
  return [...new Set(out)];
}

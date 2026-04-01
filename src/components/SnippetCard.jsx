import { timeAgo } from '../utils/helpers';

export default function SnippetCard({ snippet: s, onDelete }) {
  return (
    <div className="snip-card">
      <p className="snip-text">"{s.text}"</p>
      <div className="snip-footer">
        <div>
          <a href={s.articleUrl} target="_blank" rel="noopener noreferrer" className="snip-link">
            {s.articleTitle}
          </a>
          <p className="snip-meta">{timeAgo(s.savedAt)}</p>
        </div>
        <button className="snip-del" onClick={onDelete} title="Delete">🗑</button>
      </div>
    </div>
  );
}

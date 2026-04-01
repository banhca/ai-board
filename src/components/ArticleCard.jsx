import { useState } from 'react';
import { SOURCES } from '../config/constants';
import { timeAgo, numFmt } from '../utils/helpers';

function SrcBadge({ srcId }) {
  const cfg = SOURCES[srcId] || { label: srcId, color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' };
  return (
    <span className="src-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

export default function ArticleCard({ article: a, isSaved, isRead, isPrimary, roleTags, onSave, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);
  const src         = SOURCES[a.source];
  const primaryTags = a.tags?.filter(t => roleTags.includes(t)) || [];
  const otherTags   = a.tags?.filter(t => !roleTags.includes(t)) || [];

  return (
    <div
      className={`article-card ${isRead ? 'is-read' : ''} ${!isPrimary ? 'secondary' : ''}`}
      data-article-id={a.id}
    >
      <div className="card-top">
        <div className="card-body">
          <div className="card-meta">
            <SrcBadge srcId={a.source} />
            {src?.thread && <span className="thread-badge">{src.thread}</span>}
            {isRead && <span className="read-badge">✓ Read</span>}
            <span className="meta-txt">{timeAgo(a.publishedAt)}</span>
            {a.score > 0    && <span className="meta-txt">▲ {numFmt(a.score)}</span>}
            {a.comments > 0 && <span className="meta-txt">💬 {numFmt(a.comments)}</span>}
            {a.author       && <span className="meta-txt">{a.author}</span>}
          </div>

          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-title"
            onClick={() => { if (!isRead) onMarkRead(a.id); }}
          >
            {a.title}
          </a>

          {a.excerpt && (
            <p className="card-excerpt">
              {expanded ? a.excerpt : a.excerpt.slice(0, 220)}
              {a.excerpt.length > 220 && (
                <button className="more-btn" onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'less' : '…more'}
                </button>
              )}
            </p>
          )}

          {a.tags?.length > 0 && (
            <div className="card-tags">
              {primaryTags.map(t => <span key={t} className="tag-chip primary">{t}</span>)}
              {otherTags.map(t   => <span key={t} className="tag-chip">{t}</span>)}
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={onSave}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            {isSaved ? '★' : '☆'}
          </button>
          <button
            className={`read-toggle ${isRead ? 'read' : ''}`}
            onClick={() => onMarkRead(a.id)}
            title={isRead ? 'Mark unread' : 'Mark as read'}
          >
            {isRead ? '👁' : '○'}
          </button>
        </div>
      </div>
    </div>
  );
}

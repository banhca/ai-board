import ArticleCard from './ArticleCard';
import SourceFilterBar from './SourceFilterBar';

export default function FeedView({
  articles, allFiltered, primaryFeed, secondaryFeed,
  roleData, roleTags, savedIds, readIds,
  activeTag, activeGroup, setActiveGroup,
  loading, onSave, onMarkRead,
}) {
  return (
    <>
      <div className="section-header">
        <span className="section-title">
          {activeTag ? `#${activeTag}` : 'All topics'} · {allFiltered.length} articles
        </span>
      </div>

      <SourceFilterBar articles={articles} activeGroup={activeGroup} onSelect={setActiveGroup} />

      {loading && articles.length === 0 ? (
        <div className="loading" style={{ marginTop: 32 }}>
          <div className="spin">⟳</div>
          <p style={{ marginTop: 12, fontSize: 14 }}>Loading from 10 sources...</p>
          <p style={{ fontSize: 12, marginTop: 6, color: '#334155' }}>
            HN · Reddit · Dev.to · Product Hunt · OpenAI · Anthropic · HuggingFace
          </p>
        </div>
      ) : allFiltered.length === 0 ? (
        <div className="empty" style={{ marginTop: 32 }}>
          <div className="empty-icon">🔍</div>
          <div className="empty-text">No articles found</div>
          <div className="empty-sub">Try clearing filters or refresh the feed</div>
        </div>
      ) : (
        <>
          {primaryFeed.length > 0 && (
            <>
              <div className="feed-section-label" style={{ marginTop: 16 }}>
                <div className="feed-section-line" />
                <span className="feed-section-text">
                  {roleData?.icon} For {roleData?.label} · {primaryFeed.length}
                </span>
                <div className="feed-section-line" />
              </div>
              {primaryFeed.map(a => (
                <ArticleCard key={a.id} article={a}
                  isSaved={savedIds.has(a.id)} isRead={readIds.has(a.id)}
                  isPrimary={true} roleTags={roleTags}
                  onSave={() => onSave(a.id)} onMarkRead={onMarkRead}
                />
              ))}
            </>
          )}

          {secondaryFeed.length > 0 && (
            <>
              <div className="feed-section-label">
                <div className="feed-section-line" />
                <span className="feed-section-text">Also interesting · {secondaryFeed.length}</span>
                <div className="feed-section-line" />
              </div>
              {secondaryFeed.map(a => (
                <ArticleCard key={a.id} article={a}
                  isSaved={savedIds.has(a.id)} isRead={readIds.has(a.id)}
                  isPrimary={false} roleTags={roleTags}
                  onSave={() => onSave(a.id)} onMarkRead={onMarkRead}
                />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}

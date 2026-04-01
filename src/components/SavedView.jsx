import ArticleCard from './ArticleCard';

export default function SavedView({ savedArticles, savedIds, readIds, roleTags, onSave, onMarkRead }) {
  return (
    <>
      <div className="section-header">
        <span className="section-title">★ Saved articles · {savedArticles.length}</span>
      </div>

      {savedArticles.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">☆</div>
          <div className="empty-text">No saved articles yet</div>
          <div className="empty-sub">Tap ☆ on any article to save it permanently</div>
        </div>
      ) : savedArticles.map(a => (
        <ArticleCard key={a.id} article={a}
          isSaved={true} isRead={readIds.has(a.id)}
          isPrimary={true} roleTags={roleTags}
          onSave={() => onSave(a.id)} onMarkRead={onMarkRead}
        />
      ))}
    </>
  );
}

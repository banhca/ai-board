import SnippetCard from './SnippetCard';

export default function SnippetsView({ snippets, onDelete }) {
  return (
    <>
      <div className="section-header">
        <span className="section-title">💬 Saved snippets · {snippets.length}</span>
      </div>

      {snippets.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✏️</div>
          <div className="empty-text">No snippets yet</div>
          <div className="empty-sub">Select any text in an article → click "Save snippet"</div>
        </div>
      ) : snippets.map(s => (
        <SnippetCard key={s.id} snippet={s} onDelete={() => onDelete(s.id)} />
      ))}
    </>
  );
}

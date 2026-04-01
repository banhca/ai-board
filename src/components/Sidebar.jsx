import { REFRESH_OPTIONS } from '../config/constants';

export default function Sidebar({
  user, roleData, view, setView,
  articleCount, savedCount, snippetCount,
  refreshMs, setRefreshMs, lastFetch, loading,
  onRefresh, onChangeRole,
}) {
  const hoursNext = Math.max(0, Math.ceil((refreshMs - (Date.now() - lastFetch)) / 3600000));

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">🤖</span>
        <div>
          <div className="logo-name">AI Board</div>
          <div className="logo-sub">Personalized AI summarize<br />for development team</div>
        </div>
      </div>

      <div className="user-card">
        <div className="uc-icon">{roleData?.icon}</div>
        <div className="uc-name">{user.name}</div>
        <div className="uc-role">{roleData?.label}</div>
      </div>

      <nav className="nav">
        {[
          { id: 'feed',     icon: '📰', label: 'Feed',     count: articleCount },
          { id: 'saved',    icon: '★',  label: 'Saved',    count: savedCount },
          { id: 'snippets', icon: '💬', label: 'Snippets', count: snippetCount },
        ].map(item => (
          <button
            key={item.id}
            className={`nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-left">{item.icon} {item.label}</span>
            {item.count > 0 && <span className="nav-badge">{item.count}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-label">Refresh interval</div>
        <div className="interval-btns">
          {REFRESH_OPTIONS.map(opt => (
            <button
              key={opt.label}
              className={`interval-btn ${refreshMs === opt.ms ? 'active' : ''}`}
              onClick={() => setRefreshMs(opt.ms)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="btn-refresh" onClick={onRefresh} disabled={loading}>
          {loading ? '⟳ Fetching...' : `↻ Refresh${hoursNext > 0 ? ` (${hoursNext}h)` : ''}`}
        </button>
        <button className="btn-ghost" onClick={onChangeRole}>
          Change role
        </button>
      </div>
    </aside>
  );
}

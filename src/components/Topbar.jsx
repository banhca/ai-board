import { ALL_TAGS } from '../config/constants';

export default function Topbar({ search, setSearch, activeTag, setActiveTag, hideRead, setHideRead, readCount, fetchError }) {
  return (
    <div className="topbar">
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
        />
      </div>

      <div className="topbar-tags">
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(p => p === tag ? '' : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <button
        className={`hide-read-btn ${hideRead ? 'active' : ''}`}
        onClick={() => setHideRead(p => !p)}
        title="Hide read articles"
      >
        {hideRead ? '👁 Show read' : `Hide read (${readCount})`}
      </button>

      {fetchError && <div className="err-banner">{fetchError}</div>}
    </div>
  );
}

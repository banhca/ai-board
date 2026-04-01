import { useMemo } from 'react';
import { SOURCE_GROUPS, getGroup } from '../config/constants';

export default function SourceFilterBar({ articles, activeGroup, onSelect }) {
  const counts = useMemo(() => {
    const m = {};
    articles.forEach(a => {
      const g = getGroup(a.source);
      m[g] = (m[g] || 0) + 1;
    });
    return m;
  }, [articles]);

  return (
    <div className="src-filters">
      {Object.entries(SOURCE_GROUPS).map(([id, cfg]) => {
        if (!counts[id]) return null;
        const isActive = activeGroup === id;
        return (
          <button
            key={id}
            className={`src-filter-btn ${isActive ? 'active' : ''}`}
            style={isActive ? { color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.color + '60' } : {}}
            onClick={() => onSelect(activeGroup === id ? '' : id)}
          >
            {cfg.label}
            <span className="src-filter-count">{counts[id]}</span>
          </button>
        );
      })}
    </div>
  );
}

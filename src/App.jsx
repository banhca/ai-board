import { useState, useEffect, useCallback, useMemo } from 'react';
import { ROLES, EXPIRY_7D, getGroup } from './config/constants';
import storage from './utils/storage';
import { fetchAll } from './services/fetchers';
import { useToast } from './hooks/useToast';
import { useSelection } from './hooks/useSelection';

import Onboarding    from './components/Onboarding';
import Sidebar       from './components/Sidebar';
import Topbar        from './components/Topbar';
import FeedView      from './components/FeedView';
import SavedView     from './components/SavedView';
import SnippetsView  from './components/SnippetsView';
import Toast         from './components/Toast';

export default function App() {
  // ── Persisted state ──────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => storage.get('aib_user'));

  const [articles, setArticles] = useState(() => {
    const now      = Date.now();
    const savedIds = new Set(storage.get('aib_saved', []));
    return storage.get('aib_articles', [])
      .filter(a => savedIds.has(a.id) || (now - (a.fetchedAt || 0) < EXPIRY_7D));
  });

  const [savedIds,   setSavedIds]   = useState(() => new Set(storage.get('aib_saved',      [])));
  const [readIds,    setReadIds]    = useState(() => new Set(storage.get('aib_read',        [])));
  const [snippets,   setSnippets]   = useState(() => storage.get('aib_snippets',   []));
  const [lastFetch,  setLastFetch]  = useState(() => storage.get('aib_last_fetch', 0));
  const [refreshMs,  setRefreshMs]  = useState(() => storage.get('aib_refresh_ms', 12 * 3600000));

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [loading,    setLoading]    = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [view,       setView]       = useState('feed');
  const [activeTag,  setActiveTag]  = useState('');
  const [activeGroup,setActiveGroup]= useState('');
  const [search,     setSearch]     = useState('');
  const [hideRead,   setHideRead]   = useState(false);

  // ── Hooks ─────────────────────────────────────────────────────────────────────
  const [toast, showToast, dismissToast] = useToast();
  const { selPos, selText, selArticle, clear: clearSel } = useSelection(articles);

  // ── Persist to localStorage ───────────────────────────────────────────────────
  useEffect(() => { storage.set('aib_articles',   articles.map(a => ({ ...a, _saved: savedIds.has(a.id) }))); }, [articles, savedIds]);
  useEffect(() => { storage.set('aib_saved',       [...savedIds]); }, [savedIds]);
  useEffect(() => { storage.set('aib_read',        [...readIds]);  }, [readIds]);
  useEffect(() => { storage.set('aib_snippets',    snippets);      }, [snippets]);
  useEffect(() => { storage.set('aib_refresh_ms',  refreshMs);     }, [refreshMs]);

  // ── Auto-fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (Date.now() - lastFetch > refreshMs || articles.length === 0) doFetch();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch logic ───────────────────────────────────────────────────────────────
  const doFetch = async () => {
    setLoading(true); setFetchError('');
    try {
      const fresh = await fetchAll();
      setArticles(prev => {
        const savedArts  = prev.filter(a => savedIds.has(a.id));
        const freshUrls  = new Set(fresh.map(a => a.url));
        const keepOld    = savedArts.filter(a => !freshUrls.has(a.url));
        return [...fresh, ...keepOld];
      });
      const now = Date.now();
      setLastFetch(now);
      storage.set('aib_last_fetch', now);
      showToast('Feed updated');
    } catch {
      setFetchError('Some sources failed. Showing cached content.');
    }
    setLoading(false);
  };

  // ── Actions ───────────────────────────────────────────────────────────────────
  const toggleSave = id => {
    setSavedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); showToast('Removed from saved'); }
      else           { n.add(id);    showToast('Article saved');       }
      return n;
    });
  };

  const markRead = useCallback(id => {
    setReadIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }, []);

  const saveSnippet = () => {
    if (!selText) return;
    const snip = {
      id: `snip_${Date.now()}`,
      text: selText,
      articleId:    selArticle?.id    || '',
      articleTitle: selArticle?.title || '(unknown)',
      articleUrl:   selArticle?.url   || '#',
      savedAt: new Date().toISOString(),
    };
    setSnippets(p => [snip, ...p]);
    clearSel();
    showToast('Snippet saved');
  };

  const deleteSnippet = id => {
    setSnippets(p => p.filter(s => s.id !== id));
    showToast('Snippet deleted');
  };

  // ── Derived data ──────────────────────────────────────────────────────────────
  const roleData = ROLES.find(r => r.id === user?.role);
  const roleTags = roleData?.tags || [];

  const allFiltered = useMemo(() => articles.filter(a => {
    if (activeTag   && !a.tags?.includes(activeTag))                          return false;
    if (activeGroup && getGroup(a.source) !== activeGroup)                    return false;
    if (search      && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (hideRead    && readIds.has(a.id))                                     return false;
    return true;
  }), [articles, activeTag, activeGroup, search, hideRead, readIds]);

  const { primaryFeed, secondaryFeed } = useMemo(() => {
    const primary = [], secondary = [];
    allFiltered.forEach(a => {
      (a.tags?.some(t => roleTags.includes(t)) ? primary : secondary).push(a);
    });
    primary.sort((a, b)   => new Date(b.publishedAt) - new Date(a.publishedAt));
    secondary.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return { primaryFeed: primary, secondaryFeed: secondary };
  }, [allFiltered, roleTags]);

  const savedArticles = useMemo(() => articles.filter(a => savedIds.has(a.id)), [articles, savedIds]);
  const readCount     = useMemo(() => articles.filter(a => readIds.has(a.id)).length, [articles, readIds]);

  // ── Render ────────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Onboarding onComplete={u => { setUser(u); storage.set('aib_user', u); }} />
    );
  }

  return (
    <div className="app">
      <Sidebar
        user={user}
        roleData={roleData}
        view={view}
        setView={setView}
        articleCount={articles.length}
        savedCount={savedArticles.length}
        snippetCount={snippets.length}
        refreshMs={refreshMs}
        setRefreshMs={setRefreshMs}
        lastFetch={lastFetch}
        loading={loading}
        onRefresh={doFetch}
        onChangeRole={() => { storage.del('aib_user'); setUser(null); }}
      />

      <main className="main">
        <Topbar
          search={search}
          setSearch={setSearch}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          hideRead={hideRead}
          setHideRead={setHideRead}
          readCount={readCount}
          fetchError={fetchError}
        />

        <div className="content">
          {view === 'feed' && (
            <FeedView
              articles={articles}
              allFiltered={allFiltered}
              primaryFeed={primaryFeed}
              secondaryFeed={secondaryFeed}
              roleData={roleData}
              roleTags={roleTags}
              savedIds={savedIds}
              readIds={readIds}
              activeTag={activeTag}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              loading={loading}
              onSave={toggleSave}
              onMarkRead={markRead}
            />
          )}

          {view === 'saved' && (
            <SavedView
              savedArticles={savedArticles}
              savedIds={savedIds}
              readIds={readIds}
              roleTags={roleTags}
              onSave={toggleSave}
              onMarkRead={markRead}
            />
          )}

          {view === 'snippets' && (
            <SnippetsView snippets={snippets} onDelete={deleteSnippet} />
          )}
        </div>
      </main>

      {/* Snippet float button */}
      {selPos && selText && (
        <div className="snip-float" style={{ left: selPos.x, top: selPos.y }}>
          <button className="snip-save-btn" onMouseDown={e => { e.preventDefault(); saveSnippet(); }}>
            💾 Save snippet
          </button>
        </div>
      )}

      {toast && <Toast msg={toast} onClose={dismissToast} />}
    </div>
  );
}

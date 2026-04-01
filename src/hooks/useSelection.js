import { useState, useEffect } from 'react';

export function useSelection(articles) {
  const [selPos,     setSelPos]     = useState(null);
  const [selText,    setSelText]    = useState('');
  const [selArticle, setSelArticle] = useState(null);

  useEffect(() => {
    const onUp = () => {
      const sel  = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 15) { setSelPos(null); setSelText(''); return; }
      let node = sel.anchorNode;
      while (node && node !== document.body) {
        if (node.dataset?.articleId) {
          const art  = articles.find(a => a.id === node.dataset.articleId);
          const rect = sel.getRangeAt(0).getBoundingClientRect();
          setSelText(text);
          setSelArticle(art || null);
          setSelPos({ x: rect.left + rect.width / 2, y: rect.top - 14 });
          return;
        }
        node = node.parentNode;
      }
      setSelPos(null); setSelText('');
    };

    const onDown = e => {
      if (!e.target.closest('.snip-float')) { setSelPos(null); setSelText(''); }
    };

    document.addEventListener('mouseup',   onUp);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mousedown', onDown);
    };
  }, [articles]);

  const clear = () => {
    window.getSelection()?.removeAllRanges();
    setSelPos(null); setSelText(''); setSelArticle(null);
  };

  return { selPos, selText, selArticle, clear };
}

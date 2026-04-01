import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return [toast, show, dismiss];
}

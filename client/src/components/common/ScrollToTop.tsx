import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elem = document.getElementById(hash.replace('#', ''));
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

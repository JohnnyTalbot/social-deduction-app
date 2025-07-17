import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileVertical, setIsMobileVertical] = useState(false);
  const [isMobileHorizontal, setIsMobileHorizontal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobileVertical(window.innerWidth < breakpoint);
      setIsMobileHorizontal(window.innerHeight < breakpoint);
    };

    setIsMounted(true);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return {
    isMounted,
    isMobileVertical,
    isMobileHorizontal,
  };
}

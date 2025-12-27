/**
 * 画面の向き検出カスタムフック
 */

import { useState, useEffect } from 'react';

interface UseOrientationReturn {
  readonly isLandscape: boolean;
}

export const useOrientation = (): UseOrientationReturn => {
  const [isLandscape, setIsLandscape] = useState(
    () => window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    // オリエンテーション変更イベントもリッスン
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isLandscape };
};

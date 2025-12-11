import { useState, useEffect } from "react";

/**
 * 画面の向きを検出するカスタムフック
 * @returns isLandscape - 横画面かどうか
 */
export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(orientation: landscape)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsLandscape(e.matches);
    };

    // イベントリスナーを追加
    mediaQuery.addEventListener("change", handleChange);

    // 初期値を設定
    setIsLandscape(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return { isLandscape };
}

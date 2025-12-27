/**
 * タイマー関連の定数
 */

/** タイマーの更新間隔（ミリ秒） */
export const TIMER_TICK_INTERVAL = 100;

/** 残り時間が少ない警告の閾値（ミリ秒） */
export const LOW_TIME_THRESHOLD = 30000; // 30秒

/** 残り時間が非常に少ない警告の閾値（ミリ秒） */
export const CRITICAL_TIME_THRESHOLD = 10000; // 10秒

/** 秒読みでミリ秒表示を開始する閾値（ミリ秒） */
export const SHOW_MILLIS_THRESHOLD = 60000; // 60秒

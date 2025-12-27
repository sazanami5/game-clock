/**
 * 音声・音響関連の定数
 */

/** ブザー音のデフォルト周波数（Hz） */
export const DEFAULT_BUZZER_FREQUENCY = 880;

/** 短いブザー音の再生時間（秒） */
export const SHORT_BEEP_DURATION = 0.15;

/** 長いブザー音の再生時間（秒） */
export const LONG_BEEP_DURATION = 0.3;

/** 連続ブザー音の再生時間（秒） */
export const CONTINUOUS_BEEP_DURATION = 5.0;

/** 秒読み時に音声を再生する秒数 */
export const BYOYOMI_CALL_SECONDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30] as const;

/** 秒読みで連続音を開始する秒数 */
export const BYOYOMI_CONTINUOUS_START = 5;

/** 日本語ロケール */
export const LOCALE_JAPANESE = 'ja-JP';

/** 英語ロケール */
export const LOCALE_ENGLISH = 'en-US';

/** 音声合成のデフォルト速度 */
export const SPEECH_RATE_NORMAL = 1.0;

/** 音声合成の速い速度 */
export const SPEECH_RATE_FAST = 1.2;

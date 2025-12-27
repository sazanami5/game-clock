/**
 * 型定義のエクスポート
 */

// ゲームモード
export type { GameModeType, GameModeSettings, Preset } from './game-mode';
export { DEFAULT_GAME_MODE_SETTINGS } from './game-mode';

// プレイヤー
export type { PlayerState } from './player';
export { createInitialPlayerState } from './player';

// タイマー
export type { PlayerNumber, TimerState } from './timer';

// 音声
export type { VoiceType, VolumeLevel, SoundSettings } from './sound';
export { DEFAULT_SOUND_SETTINGS } from './sound';

// 設定
export type { HandicapSettings, AppSettings } from './settings';

// デフォルトのアプリケーション設定
import { DEFAULT_GAME_MODE_SETTINGS } from './game-mode';
import { DEFAULT_SOUND_SETTINGS } from './sound';
import type { AppSettings } from './settings';

export const DEFAULT_APP_SETTINGS: Readonly<AppSettings> = {
  gameMode: DEFAULT_GAME_MODE_SETTINGS,
  sound: DEFAULT_SOUND_SETTINGS,
  handicap: {
    enabled: false,
    player1Time: 600,
    player2Time: 600,
  },
} as const;

// 後方互換性のための旧名称のエクスポート
/** @deprecated Use DEFAULT_GAME_MODE_SETTINGS instead */
export const defaultGameModeSettings = DEFAULT_GAME_MODE_SETTINGS;
/** @deprecated Use DEFAULT_SOUND_SETTINGS instead */
export const defaultSoundSettings = DEFAULT_SOUND_SETTINGS;
/** @deprecated Use DEFAULT_APP_SETTINGS instead */
export const defaultAppSettings = DEFAULT_APP_SETTINGS;

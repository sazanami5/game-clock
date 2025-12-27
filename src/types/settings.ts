/**
 * アプリケーション設定関連の型定義
 */

import type { GameModeSettings } from './game-mode';
import type { SoundSettings } from './sound';

/** ハンデ設定 */
export interface HandicapSettings {
  readonly enabled: boolean;
  readonly player1Time: number;
  readonly player2Time: number;
}

/** アプリケーション設定 */
export interface AppSettings {
  /** ゲームモード設定 */
  readonly gameMode: GameModeSettings;
  /** 音声設定 */
  readonly sound: SoundSettings;
  /** ハンデ設定（プレイヤー2の持ち時間調整、秒単位） */
  readonly handicap: HandicapSettings;
}

/**
 * プレイヤー関連の型定義
 */

import type { GameModeSettings } from './game-mode';

/** プレイヤーの状態 */
export interface PlayerState {
  /** 残り持ち時間（ミリ秒） */
  readonly remainingTime: number;
  /** 残り秒読み回数 */
  readonly byoyomiRemaining: number;
  /** 残り考慮時間回数 */
  readonly considerationRemaining: number;
  /** 現在秒読み中かどうか */
  readonly isInByoyomi: boolean;
  /** 現在考慮時間中かどうか */
  readonly isInConsideration: boolean;
  /** 手数 */
  readonly moveCount: number;
  /** 時間切れかどうか */
  readonly isTimeUp: boolean;
  /** 現在の期間での手数（カナダ式用） */
  readonly movesInPeriod: number;
}

/** デフォルトのプレイヤー状態を作成 */
export const createInitialPlayerState = (
  settings: GameModeSettings
): PlayerState => ({
  remainingTime: settings.mainTime * 1000,
  byoyomiRemaining: settings.byoyomiCount,
  considerationRemaining: settings.considerationCount,
  isInByoyomi: false,
  isInConsideration: false,
  moveCount: 0,
  isTimeUp: false,
  movesInPeriod: 0,
});

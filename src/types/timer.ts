/**
 * タイマー関連の型定義
 */

import type { PlayerState } from './player';

/** プレイヤー番号 */
export type PlayerNumber = 1 | 2;

/** タイマーの状態 */
export interface TimerState {
  /** プレイヤー1（上/先手/白）の状態 */
  readonly player1: PlayerState;
  /** プレイヤー2（下/後手/黒）の状態 */
  readonly player2: PlayerState;
  /** 現在アクティブなプレイヤー（1 or 2, null = 停止中） */
  readonly activePlayer: PlayerNumber | null;
  /** ゲームが開始されたかどうか */
  readonly isStarted: boolean;
  /** 一時停止中かどうか */
  readonly isPaused: boolean;
  /** ゲームが終了したかどうか */
  readonly isGameOver: boolean;
  /** 総経過時間（ミリ秒） */
  readonly elapsedTime: number;
}

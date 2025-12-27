/**
 * コントロールパネルコンポーネント
 * タイマーの操作ボタン（一時停止、再開、リセット、設定、入替）を表示
 */

import {
  SettingsIcon,
  PlayIcon,
  PauseIcon,
  SwapIcon,
  ResetIcon,
} from '../Icons';
import type { TimerState } from '../../types';

interface ControlPanelProps {
  /** タイマーの状態 */
  readonly state: TimerState;
  /** 一時停止ボタン押下時のコールバック */
  readonly onPause: () => void;
  /** 再開ボタン押下時のコールバック */
  readonly onResume: () => void;
  /** リセットボタン押下時のコールバック */
  readonly onReset: () => void;
  /** 設定ボタン押下時のコールバック */
  readonly onSettings: () => void;
  /** 残時間入替ボタン押下時のコールバック（千日手対応） */
  readonly onSwapTimes: () => void;
  /** 横画面かどうか */
  readonly isLandscape?: boolean;
}

export const ControlPanel = ({
  state,
  onPause,
  onResume,
  onReset,
  onSettings,
  onSwapTimes,
  isLandscape = false,
}: ControlPanelProps) => {
  const { isStarted, isPaused, isGameOver } = state;

  return (
    <nav
      className={`bg-gradient-panel flex items-center gap-2 ${
        isLandscape
          ? 'flex-col px-2 py-3 border-x border-accent-10'
          : 'flex-col px-3 py-2 border-y border-accent-10'
      }`}
      aria-label="タイマー操作"
      role="toolbar"
    >
      <div
        className={`flex gap-2 justify-center ${
          isLandscape ? 'flex-col' : 'flex-wrap'
        }`}
        role="group"
      >
        {!isStarted ? (
          // ゲーム開始前は設定ボタンのみ表示
          <button
            type="button"
            className="control-btn"
            onClick={onSettings}
            aria-label="設定を開く"
          >
            <SettingsIcon />
            <span>設定</span>
          </button>
        ) : (
          <>
            {/* 一時停止/再開ボタン */}
            {isPaused ? (
              <button
                type="button"
                className="control-btn control-btn-resume"
                onClick={onResume}
                disabled={isGameOver}
                aria-label="タイマーを再開"
                aria-disabled={isGameOver}
              >
                <PlayIcon />
                <span>再開</span>
              </button>
            ) : (
              <button
                type="button"
                className="control-btn control-btn-pause"
                onClick={onPause}
                disabled={isGameOver}
                aria-label="タイマーを一時停止"
                aria-disabled={isGameOver}
              >
                <PauseIcon />
                <span>一時停止</span>
              </button>
            )}

            {/* 残時間入替ボタン（千日手対応） */}
            <button
              type="button"
              className="control-btn control-btn-swap"
              onClick={onSwapTimes}
              disabled={isGameOver}
              aria-label="残り時間を入れ替える（千日手対応）"
              aria-disabled={isGameOver}
            >
              <SwapIcon />
              <span>入替</span>
            </button>

            {/* リセットボタン */}
            <button
              type="button"
              className="control-btn control-btn-reset"
              onClick={onReset}
              aria-label="タイマーをリセット"
            >
              <ResetIcon />
              <span>リセット</span>
            </button>

            {/* 設定ボタン */}
            <button
              type="button"
              className="control-btn"
              onClick={onSettings}
              aria-label="設定を開く"
            >
              <SettingsIcon />
              <span>設定</span>
            </button>
          </>
        )}
      </div>

      {/* 操作ヒント（ゲーム開始前のみ表示） */}
      {!isStarted && (
        <p
          className="text-xs text-color-dim m-0 animate-fade-pulse"
          role="status"
          aria-live="polite"
        >
          画面をタップして対局開始
        </p>
      )}
    </nav>
  );
};

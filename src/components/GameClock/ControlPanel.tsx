import { TimerState } from "../../types";

interface ControlPanelProps {
  /** タイマーの状態 */
  state: TimerState;
  /** 一時停止ボタン押下時のコールバック */
  onPause: () => void;
  /** 再開ボタン押下時のコールバック */
  onResume: () => void;
  /** リセットボタン押下時のコールバック */
  onReset: () => void;
  /** 設定ボタン押下時のコールバック */
  onSettings: () => void;
  /** 残時間入替ボタン押下時のコールバック（千日手対応） */
  onSwapTimes: () => void;
}

/**
 * コントロールパネルコンポーネント
 * タイマーの操作ボタン（一時停止、再開、リセット、設定、入替）を表示
 */
export function ControlPanel({
  state,
  onPause,
  onResume,
  onReset,
  onSettings,
  onSwapTimes,
}: ControlPanelProps) {
  const { isStarted, isPaused, isGameOver } = state;

  return (
    <nav
      className="bg-gradient-panel px-3 py-2 flex flex-col items-center gap-2 border-y border-accent-10"
      aria-label="タイマー操作"
      role="toolbar"
    >
      <div className="flex gap-2 flex-wrap justify-center" role="group">
        {!isStarted ? (
          // ゲーム開始前は設定ボタンのみ表示
          <button
            type="button"
            className="control-btn"
            onClick={onSettings}
            aria-label="設定を開く"
          >
            <SettingsIcon aria-hidden="true" />
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
                <PlayIcon aria-hidden="true" />
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
                <PauseIcon aria-hidden="true" />
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
              <SwapIcon aria-hidden="true" />
              <span>入替</span>
            </button>

            {/* リセットボタン */}
            <button
              type="button"
              className="control-btn control-btn-reset"
              onClick={onReset}
              aria-label="タイマーをリセット"
            >
              <ResetIcon aria-hidden="true" />
              <span>リセット</span>
            </button>

            {/* 設定ボタン */}
            <button
              type="button"
              className="control-btn"
              onClick={onSettings}
              aria-label="設定を開く"
            >
              <SettingsIcon aria-hidden="true" />
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
}

// アイコンコンポーネント（SVG）
// すべてaria-hidden="true"を親から受け取り、装飾的要素として扱う

function SettingsIcon({
  "aria-hidden": ariaHidden,
}: {
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden={ariaHidden}
      focusable="false"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4m0 14v4M1 12h4m14 0h4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83" />
    </svg>
  );
}

function PlayIcon({
  "aria-hidden": ariaHidden,
}: {
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={ariaHidden}
      focusable="false"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({
  "aria-hidden": ariaHidden,
}: {
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={ariaHidden}
      focusable="false"
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function SwapIcon({
  "aria-hidden": ariaHidden,
}: {
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden={ariaHidden}
      focusable="false"
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function ResetIcon({
  "aria-hidden": ariaHidden,
}: {
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden={ariaHidden}
      focusable="false"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

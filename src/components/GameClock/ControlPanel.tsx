import { TimerState } from "../../types";

interface ControlPanelProps {
  state: TimerState;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSettings: () => void;
  onSwapTimes: () => void;
}

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
    <div className="bg-gradient-panel px-3 py-2 flex flex-col items-center gap-2 border-y border-accent-10">
      <div className="flex gap-2 flex-wrap justify-center">
        {!isStarted ? (
          <button className="control-btn" onClick={onSettings}>
            <SettingsIcon />
            設定
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                className="control-btn control-btn-resume"
                onClick={onResume}
                disabled={isGameOver}
              >
                <PlayIcon />
                再開
              </button>
            ) : (
              <button
                className="control-btn control-btn-pause"
                onClick={onPause}
                disabled={isGameOver}
              >
                <PauseIcon />
                一時停止
              </button>
            )}

            <button
              className="control-btn control-btn-swap"
              onClick={onSwapTimes}
              disabled={isGameOver}
              title="千日手対応: 残時間入れ替え"
            >
              <SwapIcon />
              入替
            </button>

            <button className="control-btn control-btn-reset" onClick={onReset}>
              <ResetIcon />
              リセット
            </button>

            <button className="control-btn" onClick={onSettings}>
              <SettingsIcon />
              設定
            </button>
          </>
        )}
      </div>

      {!isStarted && (
        <p className="text-xs text-color-dim m-0 animate-fade-pulse">
          画面をタップして対局開始
        </p>
      )}
    </div>
  );
}

// Icon Components
function SettingsIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4m0 14v4M1 12h4m14 0h4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

import { PlayerState, GameModeSettings } from "../../types";
import { formatTime } from "../../utils/timerModes";

interface TimerDisplayProps {
  /** プレイヤーの状態 */
  player: PlayerState;
  /** ゲームモード設定 */
  settings: GameModeSettings;
  /** このプレイヤーがアクティブかどうか */
  isActive: boolean;
  /** 180度回転表示するかどうか（対面プレイヤー用） */
  isReversed?: boolean;
  /** プレイヤーのラベル（例: "先手 / 白"） */
  playerLabel: string;
  /** プレイヤー番号（アクセシビリティ用） */
  playerNumber: 1 | 2;
  /** タップ時のコールバック */
  onTap: () => void;
  /** 横画面かどうか */
  isLandscape?: boolean;
}

/**
 * タイマー表示コンポーネント
 * 各プレイヤーの残り時間と状態を表示し、タップで手番を交代する
 */
export function TimerDisplay({
  player,
  settings,
  isActive,
  isReversed = false,
  playerLabel,
  playerNumber,
  onTap,
  isLandscape = false,
}: TimerDisplayProps) {
  // 残り時間が少ない場合の警告状態を判定
  const isLowTime = player.remainingTime < 30000 && player.remainingTime > 0;
  const isCriticalTime =
    player.remainingTime < 10000 && player.remainingTime > 0;

  /**
   * 現在の状態テキストを取得
   * 秒読み中、考慮時間中などの状態を表示
   */
  const getStatusText = () => {
    if (player.isTimeUp) return "時間切れ";
    if (player.isInConsideration)
      return `考慮時間 残り${player.considerationRemaining}回`;
    if (player.isInByoyomi) {
      if (settings.type === "byoyomi_multi" && player.byoyomiRemaining > 1) {
        return `秒読み 残り${player.byoyomiRemaining}回`;
      }
      return "秒読み";
    }
    return "";
  };

  const statusText = getStatusText();

  // ボタンのクラス名を動的に生成
  const buttonClasses = [
    "timer-btn",
    isActive && "timer-btn-active",
    isReversed && "timer-btn-reversed",
    isLandscape && "timer-btn-landscape",
    player.isTimeUp && "timer-btn-timeup",
    isCriticalTime && "animate-pulse-critical",
    isLowTime && !isCriticalTime && "animate-pulse-warning",
  ]
    .filter(Boolean)
    .join(" ");

  // 時間表示のクラス名を動的に生成
  const timeClasses = [
    isLandscape
      ? "text-[clamp(2rem,8vw,5rem)] font-bold tracking-wide"
      : "text-[clamp(3rem,15vw,6rem)] font-bold tracking-wide",
    isActive && !player.isTimeUp
      ? "text-color-accent time-glow-active"
      : "text-color-text time-glow",
    player.isTimeUp && "text-color-danger time-glow-danger",
  ]
    .filter(Boolean)
    .join(" ");

  // スクリーンリーダー用のアナウンステキストを生成
  const getAriaLabel = () => {
    const time = formatTime(
      player.remainingTime,
      player.isInByoyomi || isCriticalTime
    );
    const activeStatus = isActive ? "、手番です" : "";
    const timeStatus = player.isTimeUp
      ? "、時間切れ"
      : statusText
      ? `、${statusText}`
      : "";
    return `${playerLabel}、残り時間${time}、手数${player.moveCount}${activeStatus}${timeStatus}`;
  };

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onTap}
      disabled={player.isTimeUp}
      aria-label={getAriaLabel()}
      aria-pressed={isActive}
      aria-disabled={player.isTimeUp}
      aria-describedby={`timer-status-${playerNumber}`}
      // キーボード操作: Enter/Spaceで手番交代
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!player.isTimeUp) {
            onTap();
          }
        }
      }}
    >
      {/* メインコンテンツ */}
      <div className="flex flex-col items-center gap-2" aria-hidden="true">
        {/* プレイヤーラベル */}
        <div className="text-base font-medium text-color-muted uppercase tracking-wider">
          {playerLabel}
        </div>

        {/* 残り時間表示 */}
        <div className={timeClasses} role="timer" aria-live="off">
          {formatTime(
            player.remainingTime,
            player.isInByoyomi || isCriticalTime
          )}
        </div>

        {/* ステータス表示（秒読み等） */}
        {statusText && (
          <div
            id={`timer-status-${playerNumber}`}
            className={`text-sm font-medium px-3 py-1 rounded ${
              player.isTimeUp
                ? "text-color-danger bg-danger-10"
                : "text-color-accent bg-accent-10"
            }`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </div>
        )}

        {/* 手数表示 */}
        <div className="text-xs text-color-dim">手数: {player.moveCount}</div>
      </div>

      {/* アクティブインジケーター */}
      {isActive && !player.isTimeUp && (
        <div
          className={
            isLandscape
              ? `absolute top-0 bottom-0 w-1 bg-gradient-accent ${
                  playerNumber === 2 ? "right-0" : "left-0"
                }`
              : "absolute bottom-0 left-0 right-0 h-1 bg-gradient-accent"
          }
          aria-hidden="true"
        />
      )}
    </button>
  );
}

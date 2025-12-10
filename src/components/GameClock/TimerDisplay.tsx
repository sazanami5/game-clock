import { PlayerState, GameModeSettings } from "../../types";
import { formatTime } from "../../utils/timerModes";

interface TimerDisplayProps {
  player: PlayerState;
  settings: GameModeSettings;
  isActive: boolean;
  isReversed?: boolean;
  playerLabel: string;
  onTap: () => void;
}

export function TimerDisplay({
  player,
  settings,
  isActive,
  isReversed = false,
  playerLabel,
  onTap,
}: TimerDisplayProps) {
  const isLowTime = player.remainingTime < 30000 && player.remainingTime > 0;
  const isCriticalTime =
    player.remainingTime < 10000 && player.remainingTime > 0;

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

  const buttonClasses = [
    "timer-btn",
    isActive && "timer-btn-active",
    isReversed && "timer-btn-reversed",
    player.isTimeUp && "timer-btn-timeup",
    isCriticalTime && "animate-pulse-critical",
    isLowTime && !isCriticalTime && "animate-pulse-warning",
  ]
    .filter(Boolean)
    .join(" ");

  const timeClasses = [
    "text-[clamp(3rem,15vw,6rem)] font-bold tracking-wide",
    isActive && !player.isTimeUp
      ? "text-color-accent time-glow-active"
      : "text-color-text time-glow",
    player.isTimeUp && "text-color-danger time-glow-danger",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      onClick={onTap}
      disabled={player.isTimeUp}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-base font-medium text-color-muted uppercase tracking-wider">
          {playerLabel}
        </div>
        <div className={timeClasses}>
          {formatTime(
            player.remainingTime,
            player.isInByoyomi || isCriticalTime
          )}
        </div>
        {statusText && (
          <div
            className={`text-sm font-medium px-3 py-1 rounded ${
              player.isTimeUp
                ? "text-color-danger bg-danger-10"
                : "text-color-accent bg-accent-10"
            }`}
          >
            {statusText}
          </div>
        )}
        <div className="text-xs text-color-dim">手数: {player.moveCount}</div>
      </div>
      {isActive && !player.isTimeUp && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-accent" />
      )}
    </button>
  );
}

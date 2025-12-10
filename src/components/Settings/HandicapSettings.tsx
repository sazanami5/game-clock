import { AppSettings } from "../../types";
import { TimeInput } from "./TimeInput";

interface HandicapSettingsProps {
  handicap: AppSettings["handicap"];
  onChange: (updates: Partial<AppSettings["handicap"]>) => void;
}

export function HandicapSettings({
  handicap,
  onChange,
}: HandicapSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-color-border bg-color-card text-color-accent focus:ring-accent-50"
            checked={handicap.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          <span className="text-sm text-color-text">ハンデを有効にする</span>
        </label>
      </div>

      {handicap.enabled && (
        <div className="space-y-4 pl-6 border-l-2 border-accent-20">
          <TimeInput
            label="先手 / 白の持ち時間"
            value={handicap.player1Time}
            onChange={(seconds) => onChange({ player1Time: seconds })}
            showHours
          />
          <TimeInput
            label="後手 / 黒の持ち時間"
            value={handicap.player2Time}
            onChange={(seconds) => onChange({ player2Time: seconds })}
            showHours
          />
        </div>
      )}
    </div>
  );
}

import { GameModeType } from "../../types";

interface ModeSelectorProps {
  value: GameModeType;
  onChange: (mode: GameModeType) => void;
}

const modeOptions: {
  value: GameModeType;
  label: string;
  description: string;
}[] = [
  {
    value: "basic",
    label: "基本（切れ負け/秒読み）",
    description: "持ち時間終了後、一手ごとの秒読み",
  },
  {
    value: "byoyomi_multi",
    label: "秒読み複数回",
    description: "秒読みを複数回使用可能",
  },
  {
    value: "consideration",
    label: "考慮時間（NHK杯）",
    description: "秒読み＋考慮時間",
  },
  {
    value: "fischer",
    label: "フィッシャー",
    description: "着手ごとに時間加算",
  },
  {
    value: "canadian",
    label: "カナダ式",
    description: "規定手数ごとに時間追加",
  },
  {
    value: "chess_intl",
    label: "チェス国際",
    description: "規定手数後、秒読み＋加算",
  },
  {
    value: "xiangqi_intl",
    label: "シャンチー国際",
    description: "規定手数後、秒読み",
  },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="setting-label">ゲームモード</label>
      <select
        className="setting-select"
        value={value}
        onChange={(e) => onChange(e.target.value as GameModeType)}
      >
        {modeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-color-dim">
        {modeOptions.find((o) => o.value === value)?.description}
      </p>
    </div>
  );
}

import { Preset, GameModeSettings } from "../../types";
import { presets } from "../../utils/presets";

interface PresetListProps {
  currentSettings: GameModeSettings;
  onSelect: (preset: Preset) => void;
}

export function PresetList({ currentSettings, onSelect }: PresetListProps) {
  // プリセットがマッチしているか確認
  const isPresetSelected = (preset: Preset) => {
    const s = preset.settings;
    const c = currentSettings;
    return (
      s.type === c.type &&
      s.mainTime === c.mainTime &&
      s.byoyomi === c.byoyomi &&
      s.increment === c.increment
    );
  };

  // カテゴリ別に分類
  const categories = [
    {
      name: "将棋",
      presets: presets.filter(
        (p) =>
          p.id.startsWith("shogi") ||
          p.id === "nhk-cup" ||
          p.id === "abema-tournament"
      ),
    },
    {
      name: "チェス",
      presets: presets.filter((p) => p.id.startsWith("chess")),
    },
    {
      name: "囲碁",
      presets: presets.filter((p) => p.id.startsWith("go")),
    },
    {
      name: "その他",
      presets: presets.filter((p) => p.id.startsWith("canadian")),
    },
  ];

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name}>
          <h4 className="text-xs font-medium text-color-muted uppercase tracking-wider mb-2">
            {category.name}
          </h4>
          <div className="grid gap-2">
            {category.presets.map((preset) => (
              <button
                key={preset.id}
                className={`preset-card text-left ${
                  isPresetSelected(preset) ? "preset-card-selected" : ""
                }`}
                onClick={() => onSelect(preset)}
              >
                <div className="font-medium text-sm text-color-text">
                  {preset.name}
                </div>
                <div className="text-xs text-color-dim mt-0.5">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

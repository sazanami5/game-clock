/**
 * プリセット一覧コンポーネント
 */

import { PRESETS } from '../../utils/presets';
import type { Preset, GameModeSettings } from '../../types';

interface PresetListProps {
  readonly currentSettings: GameModeSettings;
  readonly onSelect: (preset: Preset) => void;
}

export const PresetList = ({
  currentSettings,
  onSelect,
}: PresetListProps) => {
  // プリセットがマッチしているか確認
  const isPresetSelected = (preset: Preset): boolean => {
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
      name: '将棋',
      presets: PRESETS.filter(
        (p) =>
          p.id.startsWith('shogi') ||
          p.id === 'nhk-cup' ||
          p.id === 'abema-tournament'
      ),
    },
    {
      name: 'チェス',
      presets: PRESETS.filter((p) => p.id.startsWith('chess')),
    },
    {
      name: '囲碁',
      presets: PRESETS.filter((p) => p.id.startsWith('go')),
    },
    {
      name: 'その他',
      presets: PRESETS.filter((p) => p.id.startsWith('canadian')),
    },
  ] as const;

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
                type="button"
                className={`preset-card text-left ${
                  isPresetSelected(preset) ? 'preset-card-selected' : ''
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
};

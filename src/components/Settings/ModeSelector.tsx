/**
 * ゲームモード選択コンポーネント
 */

import type { GameModeType } from '../../types';

interface ModeSelectorProps {
  readonly value: GameModeType;
  readonly onChange: (mode: GameModeType) => void;
}

const MODE_OPTIONS = [
  {
    value: 'basic' as const,
    label: '基本（切れ負け/秒読み）',
    description: '持ち時間終了後、一手ごとの秒読み',
  },
  {
    value: 'byoyomi_multi' as const,
    label: '秒読み複数回',
    description: '秒読みを複数回使用可能',
  },
  {
    value: 'consideration' as const,
    label: '考慮時間（NHK杯）',
    description: '秒読み＋考慮時間',
  },
  {
    value: 'fischer' as const,
    label: 'フィッシャー',
    description: '着手ごとに時間加算',
  },
  {
    value: 'canadian' as const,
    label: 'カナダ式',
    description: '規定手数ごとに時間追加',
  },
  {
    value: 'chess_intl' as const,
    label: 'チェス国際',
    description: '規定手数後、秒読み＋加算',
  },
  {
    value: 'xiangqi_intl' as const,
    label: 'シャンチー国際',
    description: '規定手数後、秒読み',
  },
] as const;

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
  const currentMode = MODE_OPTIONS.find((o) => o.value === value);

  return (
    <div className="space-y-2">
      <label className="setting-label" htmlFor="game-mode-select">
        ゲームモード
      </label>
      <select
        id="game-mode-select"
        className="setting-select"
        value={value}
        onChange={(e) => onChange(e.target.value as GameModeType)}
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {currentMode && (
        <p className="text-xs text-color-dim">{currentMode.description}</p>
      )}
    </div>
  );
};

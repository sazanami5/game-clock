/**
 * 音声設定コンポーネント
 */

import { getVoiceTypeName, getVolumeLevelName } from '../../hooks/useSound';
import type { VoiceType, VolumeLevel, SoundSettings } from '../../types';

interface SoundSettingsProps {
  readonly settings: SoundSettings;
  readonly onChange: (updates: Partial<SoundSettings>) => void;
}

const VOICE_TYPES: readonly VoiceType[] = [
  'japanese',
  'english',
  'buzzer',
  'none',
] as const;

const VOLUME_LEVELS: readonly VolumeLevel[] = [0, 1, 2, 3] as const;

export const SoundSettings = ({
  settings,
  onChange,
}: SoundSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="setting-label">音声タイプ</label>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="音声タイプ選択">
          {VOICE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                settings.voiceType === type
                  ? 'bg-accent-20 border border-accent-50 text-color-accent'
                  : 'bg-color-card border border-color-border text-color-muted hover:border-white/20'
              }`}
              onClick={() => onChange({ voiceType: type })}
              aria-pressed={settings.voiceType === type}
            >
              {getVoiceTypeName(type)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="setting-label">音量</label>
        <div className="flex gap-2" role="group" aria-label="音量選択">
          {VOLUME_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                settings.volume === level
                  ? 'bg-accent-20 border border-accent-50 text-color-accent'
                  : 'bg-color-card border border-color-border text-color-muted hover:border-white/20'
              }`}
              onClick={() => onChange({ volume: level })}
              aria-pressed={settings.volume === level}
            >
              {getVolumeLevelName(level)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import {
  VoiceType,
  VolumeLevel,
  SoundSettings as SoundSettingsType,
} from "../../types";
import { getVoiceTypeName, getVolumeLevelName } from "../../hooks/useSound";

interface SoundSettingsProps {
  settings: SoundSettingsType;
  onChange: (updates: Partial<SoundSettingsType>) => void;
}

const voiceTypes: VoiceType[] = ["japanese", "english", "buzzer", "none"];
const volumeLevels: VolumeLevel[] = [0, 1, 2, 3];

export function SoundSettings({ settings, onChange }: SoundSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="setting-label">音声タイプ</label>
        <div className="flex gap-2 flex-wrap">
          {voiceTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                settings.voiceType === type
                  ? "bg-accent-20 border border-accent-50 text-color-accent"
                  : "bg-color-card border border-color-border text-color-muted hover:border-white/20"
              }`}
              onClick={() => onChange({ voiceType: type })}
            >
              {getVoiceTypeName(type)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="setting-label">音量</label>
        <div className="flex gap-2">
          {volumeLevels.map((level) => (
            <button
              key={level}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                settings.volume === level
                  ? "bg-accent-20 border border-accent-50 text-color-accent"
                  : "bg-color-card border border-color-border text-color-muted hover:border-white/20"
              }`}
              onClick={() => onChange({ volume: level })}
            >
              {getVolumeLevelName(level)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

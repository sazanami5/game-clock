/**
 * 音声関連の型定義
 */

/** 音声タイプ */
export type VoiceType = 'japanese' | 'english' | 'buzzer' | 'none';

/** 音量レベル */
export type VolumeLevel = 0 | 1 | 2 | 3;

/** 音声設定 */
export interface SoundSettings {
  readonly voiceType: VoiceType;
  readonly volume: VolumeLevel;
}

/** デフォルトの音声設定 */
export const DEFAULT_SOUND_SETTINGS: Readonly<SoundSettings> = {
  voiceType: 'japanese',
  volume: 2,
} as const;

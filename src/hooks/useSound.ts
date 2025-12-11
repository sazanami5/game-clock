import { useCallback, useRef } from 'react';
import { SoundSettings, VoiceType, VolumeLevel } from '../types';
import {
  speakByoyomi,
  speakStart,
  speakTimeUp,
  speakConsideration,
  initSpeechSynthesis,
  stopBuzzer,
} from '../utils/speech';

interface UseSoundReturn {
  playByoyomi: (seconds: number) => void;
  playStart: () => void;
  playTimeUp: (player: 1 | 2) => void;
  playConsideration: (remaining: number) => void;
  stopByoyomiBuzzer: () => void;
  initSound: () => void;
}

export function useSound(settings: SoundSettings): UseSoundReturn {
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const playByoyomi = useCallback((seconds: number) => {
    const { voiceType, volume } = settingsRef.current;
    speakByoyomi(seconds, voiceType, volume);
  }, []);

  const playStart = useCallback(() => {
    const { voiceType, volume } = settingsRef.current;
    speakStart(voiceType, volume);
  }, []);

  const playTimeUp = useCallback((player: 1 | 2) => {
    const { voiceType, volume } = settingsRef.current;
    speakTimeUp(player, voiceType, volume);
  }, []);

  const playConsideration = useCallback((remaining: number) => {
    const { voiceType, volume } = settingsRef.current;
    speakConsideration(remaining, voiceType, volume);
  }, []);

  const stopByoyomiBuzzer = useCallback(() => {
    stopBuzzer();
  }, []);

  const initSound = useCallback(() => {
    initSpeechSynthesis();
  }, []);

  return {
    playByoyomi,
    playStart,
    playTimeUp,
    playConsideration,
    stopByoyomiBuzzer,
    initSound,
  };
}

// 音声タイプの表示名
export function getVoiceTypeName(type: VoiceType): string {
  switch (type) {
    case 'japanese':
      return '日本語';
    case 'english':
      return 'English';
    case 'buzzer':
      return 'ブザー';
    case 'none':
      return 'なし';
  }
}

// 音量レベルの表示名
export function getVolumeLevelName(level: VolumeLevel): string {
  switch (level) {
    case 0:
      return '消音';
    case 1:
      return '小';
    case 2:
      return '中';
    case 3:
      return '大';
  }
}


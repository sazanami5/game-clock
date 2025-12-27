/**
 * 音声管理カスタムフック
 */

import { useCallback, useRef, useEffect } from 'react';
import {
  speakByoyomi,
  speakStart,
  speakTimeUp,
  speakConsideration,
  stopBuzzer,
  initSpeechSynthesis,
} from '../utils/speech';
import type { SoundSettings, VoiceType, VolumeLevel, PlayerNumber } from '../types';

interface UseSoundReturn {
  readonly playByoyomi: (seconds: number) => void;
  readonly playStart: () => void;
  readonly playTimeUp: (player: PlayerNumber) => void;
  readonly playConsideration: (remaining: number) => void;
  readonly stopByoyomiBuzzer: () => void;
  readonly initSound: () => void;
}

export const useSound = (settings: SoundSettings): UseSoundReturn => {
  const settingsRef = useRef(settings);
  
  // useEffectでrefを更新
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const playByoyomi = useCallback((seconds: number) => {
    const { voiceType, volume } = settingsRef.current;
    speakByoyomi(seconds, voiceType, volume);
  }, []);

  const playStart = useCallback(() => {
    const { voiceType, volume } = settingsRef.current;
    speakStart(voiceType, volume);
  }, []);

  const playTimeUp = useCallback((player: PlayerNumber) => {
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
};

/**
 * 音声タイプの表示名を取得
 */
export const getVoiceTypeName = (type: VoiceType): string => {
  const names: Record<VoiceType, string> = {
    japanese: '日本語',
    english: 'English',
    buzzer: 'ブザー',
    none: 'なし',
  };
  return names[type];
};

/**
 * 音量レベルの表示名を取得
 */
export const getVolumeLevelName = (level: VolumeLevel): string => {
  const names: Record<VolumeLevel, string> = {
    0: '消音',
    1: '小',
    2: '中',
    3: '大',
  };
  return names[level];
};

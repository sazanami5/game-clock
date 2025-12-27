/**
 * 設定管理カスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
import { saveSettings, loadSettings } from '../utils/storage';
import type {
  AppSettings,
  GameModeSettings,
  SoundSettings,
  HandicapSettings,
  Preset,
} from '../types';

interface UseSettingsReturn {
  readonly settings: AppSettings;
  readonly updateGameMode: (updates: Partial<GameModeSettings>) => void;
  readonly updateSound: (updates: Partial<SoundSettings>) => void;
  readonly updateHandicap: (updates: Partial<HandicapSettings>) => void;
  readonly applyPreset: (preset: Preset) => void;
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // 設定が変更されたら保存
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateGameMode = useCallback(
    (updates: Partial<GameModeSettings>) => {
      setSettings((prev) => ({
        ...prev,
        gameMode: {
          ...prev.gameMode,
          ...updates,
        },
      }));
    },
    []
  );

  const updateSound = useCallback((updates: Partial<SoundSettings>) => {
    setSettings((prev) => ({
      ...prev,
      sound: {
        ...prev.sound,
        ...updates,
      },
    }));
  }, []);

  const updateHandicap = useCallback(
    (updates: Partial<HandicapSettings>) => {
      setSettings((prev) => ({
        ...prev,
        handicap: {
          ...prev.handicap,
          ...updates,
        },
      }));
    },
    []
  );

  const applyPreset = useCallback((preset: Preset) => {
    setSettings((prev) => ({
      ...prev,
      gameMode: preset.settings,
      // ハンデ設定も更新
      handicap: {
        ...prev.handicap,
        player1Time: preset.settings.mainTime,
        player2Time: preset.settings.mainTime,
      },
    }));
  }, []);

  return {
    settings,
    updateGameMode,
    updateSound,
    updateHandicap,
    applyPreset,
  };
};

import { useState, useCallback, useEffect } from 'react';
import { AppSettings, GameModeSettings, SoundSettings, defaultAppSettings } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';
import { Preset } from '../types';

interface UseSettingsReturn {
  settings: AppSettings;
  updateGameMode: (updates: Partial<GameModeSettings>) => void;
  updateSound: (updates: Partial<SoundSettings>) => void;
  updateHandicap: (updates: Partial<AppSettings['handicap']>) => void;
  applyPreset: (preset: Preset) => void;
  resetToDefaults: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // 設定が変更されたら保存
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateGameMode = useCallback((updates: Partial<GameModeSettings>) => {
    setSettings(prev => ({
      ...prev,
      gameMode: {
        ...prev.gameMode,
        ...updates,
      },
    }));
  }, []);

  const updateSound = useCallback((updates: Partial<SoundSettings>) => {
    setSettings(prev => ({
      ...prev,
      sound: {
        ...prev.sound,
        ...updates,
      },
    }));
  }, []);

  const updateHandicap = useCallback((updates: Partial<AppSettings['handicap']>) => {
    setSettings(prev => ({
      ...prev,
      handicap: {
        ...prev.handicap,
        ...updates,
      },
    }));
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setSettings(prev => ({
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

  const resetToDefaults = useCallback(() => {
    setSettings(defaultAppSettings);
  }, []);

  return {
    settings,
    updateGameMode,
    updateSound,
    updateHandicap,
    applyPreset,
    resetToDefaults,
  };
}


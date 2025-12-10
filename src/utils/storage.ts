import { AppSettings, defaultAppSettings } from '../types';

const STORAGE_KEY = 'game-clock-settings';

// 設定を保存
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// 設定を読み込み
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // デフォルト値とマージして、新しいプロパティがあっても対応
      return {
        ...defaultAppSettings,
        ...parsed,
        gameMode: {
          ...defaultAppSettings.gameMode,
          ...parsed.gameMode,
        },
        sound: {
          ...defaultAppSettings.sound,
          ...parsed.sound,
        },
        handicap: {
          ...defaultAppSettings.handicap,
          ...parsed.handicap,
        },
      };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaultAppSettings;
}

// 設定をクリア
export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear settings:', e);
  }
}


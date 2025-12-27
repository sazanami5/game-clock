/**
 * ストレージユーティリティ
 * ローカルストレージへの設定の保存と読み込み
 */

import { STORAGE_KEY } from '../constants';
import { DEFAULT_APP_SETTINGS } from '../types';
import type { AppSettings } from '../types';

/**
 * 設定をローカルストレージに保存
 * @param settings 保存する設定
 */
export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

/**
 * ローカルストレージから設定を読み込み
 * @returns 保存されている設定、または存在しない場合はデフォルト設定
 */
export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_APP_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<AppSettings>;

    // デフォルト値とマージして、新しいプロパティがあっても対応
    return {
      gameMode: {
        ...DEFAULT_APP_SETTINGS.gameMode,
        ...(parsed.gameMode ?? {}),
      },
      sound: {
        ...DEFAULT_APP_SETTINGS.sound,
        ...(parsed.sound ?? {}),
      },
      handicap: {
        ...DEFAULT_APP_SETTINGS.handicap,
        ...(parsed.handicap ?? {}),
      },
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_APP_SETTINGS;
  }
};

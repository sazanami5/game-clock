import { useState, useRef, useEffect } from "react";
import { AppSettings, GameModeSettings, Preset } from "../../types";
import { PresetList } from "./PresetList";
import { ModeSelector } from "./ModeSelector";
import { TimeInput } from "./TimeInput";
import { SoundSettings } from "./SoundSettings";
import { HandicapSettings } from "./HandicapSettings";

type TabType = "preset" | "custom" | "sound" | "handicap";

interface SettingsProps {
  /** アプリケーション設定 */
  settings: AppSettings;
  /** ゲームモード設定更新コールバック */
  onUpdateGameMode: (updates: Partial<GameModeSettings>) => void;
  /** 音声設定更新コールバック */
  onUpdateSound: (updates: Partial<AppSettings["sound"]>) => void;
  /** ハンデ設定更新コールバック */
  onUpdateHandicap: (updates: Partial<AppSettings["handicap"]>) => void;
  /** プリセット適用コールバック */
  onApplyPreset: (preset: Preset) => void;
  /** 設定画面を閉じるコールバック */
  onClose: () => void;
}

/**
 * 設定画面コンポーネント
 * モーダルダイアログとして表示され、各種設定を変更可能
 */
export function Settings({
  settings,
  onUpdateGameMode,
  onUpdateSound,
  onUpdateHandicap,
  onApplyPreset,
  onClose,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("preset");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // タブ定義
  const tabs: { id: TabType; label: string }[] = [
    { id: "preset", label: "プリセット" },
    { id: "custom", label: "カスタム" },
    { id: "sound", label: "音声" },
    { id: "handicap", label: "ハンデ" },
  ];

  // モーダルが開いた時にフォーカスを設定
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // フォーカストラップ（モーダル内にフォーカスを閉じ込める）
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    dialog.addEventListener("keydown", handleTabKey);
    return () => dialog.removeEventListener("keydown", handleTabKey);
  }, [activeTab]);

  /**
   * モード別の設定項目をレンダリング
   */
  const renderModeSpecificSettings = () => {
    const { gameMode } = settings;

    switch (gameMode.type) {
      case "basic":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <TimeInput
              label="秒読み（0で切れ負け）"
              value={gameMode.byoyomi}
              onChange={(byoyomi) => onUpdateGameMode({ byoyomi })}
              max={60}
            />
          </>
        );

      case "byoyomi_multi":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <TimeInput
              label="秒読み"
              value={gameMode.byoyomi}
              onChange={(byoyomi) => onUpdateGameMode({ byoyomi })}
              max={60}
            />
            <div>
              <label htmlFor="byoyomi-count" className="setting-label">
                秒読み回数
              </label>
              <input
                id="byoyomi-count"
                type="number"
                className="setting-input w-24"
                value={gameMode.byoyomiCount}
                onChange={(e) =>
                  onUpdateGameMode({
                    byoyomiCount: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                max={99}
                aria-describedby="byoyomi-count-desc"
              />
              <span id="byoyomi-count-desc" className="sr-only">
                1から99回まで設定可能
              </span>
            </div>
          </>
        );

      case "consideration":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <TimeInput
              label="秒読み"
              value={gameMode.byoyomi}
              onChange={(byoyomi) => onUpdateGameMode({ byoyomi })}
              max={60}
            />
            <TimeInput
              label="考慮時間"
              value={gameMode.considerationTime}
              onChange={(considerationTime) =>
                onUpdateGameMode({ considerationTime })
              }
              max={300}
            />
            <div>
              <label htmlFor="consideration-count" className="setting-label">
                考慮時間回数
              </label>
              <input
                id="consideration-count"
                type="number"
                className="setting-input w-24"
                value={gameMode.considerationCount}
                onChange={(e) =>
                  onUpdateGameMode({
                    considerationCount: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                max={99}
              />
            </div>
          </>
        );

      case "fischer":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <div>
              <label htmlFor="increment" className="setting-label">
                着手ごとの加算時間（秒）
              </label>
              <input
                id="increment"
                type="number"
                className="setting-input w-24"
                value={gameMode.increment}
                onChange={(e) =>
                  onUpdateGameMode({ increment: parseInt(e.target.value) || 0 })
                }
                min={0}
                max={60}
              />
            </div>
          </>
        );

      case "canadian":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <div>
              <label htmlFor="moves-per-period" className="setting-label">
                規定手数
              </label>
              <input
                id="moves-per-period"
                type="number"
                className="setting-input w-24"
                value={gameMode.movesPerPeriod}
                onChange={(e) =>
                  onUpdateGameMode({
                    movesPerPeriod: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                max={100}
              />
            </div>
            <TimeInput
              label="追加時間"
              value={gameMode.additionalTime}
              onChange={(additionalTime) =>
                onUpdateGameMode({ additionalTime })
              }
              showHours
            />
          </>
        );

      case "chess_intl":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <div>
              <label htmlFor="moves-per-period-chess" className="setting-label">
                規定手数
              </label>
              <input
                id="moves-per-period-chess"
                type="number"
                className="setting-input w-24"
                value={gameMode.movesPerPeriod}
                onChange={(e) =>
                  onUpdateGameMode({
                    movesPerPeriod: parseInt(e.target.value) || 40,
                  })
                }
                min={1}
                max={100}
              />
            </div>
            <TimeInput
              label="秒読み"
              value={gameMode.byoyomi}
              onChange={(byoyomi) => onUpdateGameMode({ byoyomi })}
              max={60}
            />
            <div>
              <label htmlFor="increment-chess" className="setting-label">
                着手ごとの加算時間（秒）
              </label>
              <input
                id="increment-chess"
                type="number"
                className="setting-input w-24"
                value={gameMode.increment}
                onChange={(e) =>
                  onUpdateGameMode({ increment: parseInt(e.target.value) || 0 })
                }
                min={0}
                max={60}
              />
            </div>
          </>
        );

      case "xiangqi_intl":
        return (
          <>
            <TimeInput
              label="持ち時間"
              value={gameMode.mainTime}
              onChange={(mainTime) => onUpdateGameMode({ mainTime })}
              showHours
            />
            <div>
              <label
                htmlFor="moves-per-period-xiangqi"
                className="setting-label"
              >
                規定手数
              </label>
              <input
                id="moves-per-period-xiangqi"
                type="number"
                className="setting-input w-24"
                value={gameMode.movesPerPeriod}
                onChange={(e) =>
                  onUpdateGameMode({
                    movesPerPeriod: parseInt(e.target.value) || 40,
                  })
                }
                min={1}
                max={100}
              />
            </div>
            <TimeInput
              label="秒読み"
              value={gameMode.byoyomi}
              onChange={(byoyomi) => onUpdateGameMode({ byoyomi })}
              max={60}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    // モーダルオーバーレイ
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={(e) => {
        // オーバーレイクリックでモーダルを閉じる
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="bg-color-panel border border-color-border rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        {/* ヘッダー */}
        <header className="flex items-center justify-between p-4 border-b border-color-border">
          <h2
            id="settings-title"
            className="text-lg font-semibold text-color-text"
          >
            設定
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="設定を閉じる"
          >
            <svg
              className="w-5 h-5 text-color-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* タブナビゲーション */}
        <nav
          className="flex border-b border-color-border"
          role="tablist"
          aria-label="設定カテゴリ"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-color-accent border-b-2 border-color-accent"
                  : "text-color-muted hover:text-color-text"
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                // 矢印キーでタブを切り替え
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (e.key === "ArrowRight") {
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex].id);
                } else if (e.key === "ArrowLeft") {
                  const prevIndex =
                    (currentIndex - 1 + tabs.length) % tabs.length;
                  setActiveTab(tabs[prevIndex].id);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* タブコンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* プリセットタブ */}
          <div
            id="tabpanel-preset"
            role="tabpanel"
            aria-labelledby="tab-preset"
            hidden={activeTab !== "preset"}
          >
            {activeTab === "preset" && (
              <PresetList
                currentSettings={settings.gameMode}
                onSelect={(preset) => {
                  onApplyPreset(preset);
                  onClose();
                }}
              />
            )}
          </div>

          {/* カスタムタブ */}
          <div
            id="tabpanel-custom"
            role="tabpanel"
            aria-labelledby="tab-custom"
            hidden={activeTab !== "custom"}
          >
            {activeTab === "custom" && (
              <div className="space-y-4">
                <ModeSelector
                  value={settings.gameMode.type}
                  onChange={(type) => onUpdateGameMode({ type })}
                />
                {renderModeSpecificSettings()}
              </div>
            )}
          </div>

          {/* 音声タブ */}
          <div
            id="tabpanel-sound"
            role="tabpanel"
            aria-labelledby="tab-sound"
            hidden={activeTab !== "sound"}
          >
            {activeTab === "sound" && (
              <SoundSettings
                settings={settings.sound}
                onChange={onUpdateSound}
              />
            )}
          </div>

          {/* ハンデタブ */}
          <div
            id="tabpanel-handicap"
            role="tabpanel"
            aria-labelledby="tab-handicap"
            hidden={activeTab !== "handicap"}
          >
            {activeTab === "handicap" && (
              <HandicapSettings
                handicap={settings.handicap}
                onChange={onUpdateHandicap}
              />
            )}
          </div>
        </div>

        {/* フッター */}
        <footer className="p-4 border-t border-color-border">
          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-accent-20 border border-accent-50 text-color-accent font-medium hover:bg-accent-10 transition-colors cursor-pointer"
            onClick={onClose}
          >
            閉じる
          </button>
        </footer>
      </div>
    </div>
  );
}

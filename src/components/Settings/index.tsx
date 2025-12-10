import { useState } from "react";
import { AppSettings, GameModeSettings, Preset } from "../../types";
import { PresetList } from "./PresetList";
import { ModeSelector } from "./ModeSelector";
import { TimeInput } from "./TimeInput";
import { SoundSettings } from "./SoundSettings";
import { HandicapSettings } from "./HandicapSettings";

type TabType = "preset" | "custom" | "sound" | "handicap";

interface SettingsProps {
  settings: AppSettings;
  onUpdateGameMode: (updates: Partial<GameModeSettings>) => void;
  onUpdateSound: (updates: Partial<AppSettings["sound"]>) => void;
  onUpdateHandicap: (updates: Partial<AppSettings["handicap"]>) => void;
  onApplyPreset: (preset: Preset) => void;
  onClose: () => void;
}

export function Settings({
  settings,
  onUpdateGameMode,
  onUpdateSound,
  onUpdateHandicap,
  onApplyPreset,
  onClose,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("preset");

  const tabs: { id: TabType; label: string }[] = [
    { id: "preset", label: "プリセット" },
    { id: "custom", label: "カスタム" },
    { id: "sound", label: "音声" },
    { id: "handicap", label: "ハンデ" },
  ];

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
              <label className="setting-label">秒読み回数</label>
              <input
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
              />
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
              <label className="setting-label">考慮時間回数</label>
              <input
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
              <label className="setting-label">着手ごとの加算時間（秒）</label>
              <input
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
              <label className="setting-label">規定手数</label>
              <input
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
              <label className="setting-label">規定手数</label>
              <input
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
              <label className="setting-label">着手ごとの加算時間（秒）</label>
              <input
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
              <label className="setting-label">規定手数</label>
              <input
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-color-panel border border-color-border rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-color-border">
          <h2 className="text-lg font-semibold text-color-text">設定</h2>
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5 text-color-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-color-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-color-accent border-b-2 border-color-accent"
                  : "text-color-muted hover:text-color-text"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "preset" && (
            <PresetList
              currentSettings={settings.gameMode}
              onSelect={(preset) => {
                onApplyPreset(preset);
                onClose();
              }}
            />
          )}

          {activeTab === "custom" && (
            <div className="space-y-4">
              <ModeSelector
                value={settings.gameMode.type}
                onChange={(type) => onUpdateGameMode({ type })}
              />
              {renderModeSpecificSettings()}
            </div>
          )}

          {activeTab === "sound" && (
            <SoundSettings settings={settings.sound} onChange={onUpdateSound} />
          )}

          {activeTab === "handicap" && (
            <HandicapSettings
              handicap={settings.handicap}
              onChange={onUpdateHandicap}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-color-border">
          <button
            className="w-full py-2.5 rounded-lg bg-accent-20 border border-accent-50 text-color-accent font-medium hover:bg-accent-10 transition-colors"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

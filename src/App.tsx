import { useState } from "react";
import { useSettings } from "./hooks";
import { GameClock } from "./components/GameClock";
import { Settings } from "./components/Settings";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateGameMode, updateSound, updateHandicap, applyPreset } =
    useSettings();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      <GameClock
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {isSettingsOpen && (
        <Settings
          settings={settings}
          onUpdateGameMode={updateGameMode}
          onUpdateSound={updateSound}
          onUpdateHandicap={updateHandicap}
          onApplyPreset={applyPreset}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

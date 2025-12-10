import { useCallback, useEffect, useState } from 'react';
import { AppSettings } from '../../types';
import { useTimer, useSound } from '../../hooks';
import { TimerDisplay } from './TimerDisplay';
import { ControlPanel } from './ControlPanel';

interface GameClockProps {
  settings: AppSettings;
  onOpenSettings: () => void;
}

export function GameClock({ settings, onOpenSettings }: GameClockProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { playByoyomi, playStart, playTimeUp, playConsideration, initSound } = useSound(
    settings.sound
  );

  const handleByoyomiTick = useCallback(
    (_player: 1 | 2, seconds: number) => {
      // 10秒以下、または10, 20, 30秒の時に読み上げ
      if (seconds <= 10 || seconds === 20 || seconds === 30) {
        playByoyomi(seconds);
      }
    },
    [playByoyomi]
  );

  const handleTimeUp = useCallback(
    (_player: 1 | 2) => {
      playTimeUp();
    },
    [playTimeUp]
  );

  const handleConsiderationStart = useCallback(
    (_player: 1 | 2, remaining: number) => {
      playConsideration(remaining);
    },
    [playConsideration]
  );

  const {
    state,
    start,
    pause,
    resume,
    reset,
    tap,
    swapTimes,
  } = useTimer({
    settings: settings.gameMode,
    handicap: settings.handicap,
    onByoyomiTick: handleByoyomiTick,
    onTimeUp: handleTimeUp,
    onConsiderationStart: handleConsiderationStart,
  });

  // 音声初期化（最初のタップ時）
  const handleFirstInteraction = useCallback(() => {
    if (!isInitialized) {
      initSound();
      setIsInitialized(true);
    }
  }, [isInitialized, initSound]);

  // 対局開始時に音声再生
  useEffect(() => {
    if (state.isStarted && state.activePlayer === 1 && state.player1.moveCount === 0 && state.player2.moveCount === 0) {
      playStart();
    }
  }, [state.isStarted, state.activePlayer, state.player1.moveCount, state.player2.moveCount, playStart]);

  const handleTap = useCallback(() => {
    handleFirstInteraction();
    if (!state.isStarted) {
      start(1);
    } else {
      tap();
    }
  }, [handleFirstInteraction, state.isStarted, start, tap]);

  const handlePlayer1Tap = useCallback(() => {
    if (!state.isStarted || state.activePlayer === 1) {
      handleTap();
    }
  }, [state.isStarted, state.activePlayer, handleTap]);

  const handlePlayer2Tap = useCallback(() => {
    if (!state.isStarted || state.activePlayer === 2) {
      handleTap();
    }
  }, [state.isStarted, state.activePlayer, handleTap]);

  return (
    <div className="h-full flex flex-col">
      {/* Player 2 (Top - Reversed) */}
      <TimerDisplay
        player={state.player2}
        settings={settings.gameMode}
        isActive={state.activePlayer === 2 && !state.isPaused}
        isReversed={true}
        playerLabel="後手 / 黒"
        onTap={handlePlayer2Tap}
      />

      {/* Control Panel */}
      <ControlPanel
        state={state}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSettings={onOpenSettings}
        onSwapTimes={swapTimes}
      />

      {/* Player 1 (Bottom) */}
      <TimerDisplay
        player={state.player1}
        settings={settings.gameMode}
        isActive={state.activePlayer === 1 && !state.isPaused}
        isReversed={false}
        playerLabel="先手 / 白"
        onTap={handlePlayer1Tap}
      />
    </div>
  );
}


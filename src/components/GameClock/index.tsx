import { useCallback, useEffect, useState } from "react";
import { AppSettings } from "../../types";
import { useTimer, useSound } from "../../hooks";
import { TimerDisplay } from "./TimerDisplay";
import { ControlPanel } from "./ControlPanel";

interface GameClockProps {
  /** アプリケーション設定 */
  settings: AppSettings;
  /** 設定画面を開くコールバック */
  onOpenSettings: () => void;
}

/**
 * 対局時計メインコンポーネント
 * 2人のプレイヤーのタイマーと操作パネルを管理
 */
export function GameClock({ settings, onOpenSettings }: GameClockProps) {
  // 音声システムの初期化状態
  const [isInitialized, setIsInitialized] = useState(false);

  // 音声フック
  const { playByoyomi, playStart, playTimeUp, playConsideration, initSound } =
    useSound(settings.sound);

  /**
   * 秒読み時のコールバック
   * 10秒以下、または10/20/30秒の時に読み上げ
   */
  const handleByoyomiTick = useCallback(
    (_player: 1 | 2, seconds: number) => {
      if (seconds <= 10 || seconds === 20 || seconds === 30) {
        playByoyomi(seconds);
      }
    },
    [playByoyomi]
  );

  /**
   * 時間切れ時のコールバック
   */
  const handleTimeUp = useCallback(
    (_player: 1 | 2) => {
      playTimeUp();
    },
    [playTimeUp]
  );

  /**
   * 考慮時間開始時のコールバック
   */
  const handleConsiderationStart = useCallback(
    (_player: 1 | 2, remaining: number) => {
      playConsideration(remaining);
    },
    [playConsideration]
  );

  // タイマーフック
  const { state, start, pause, resume, reset, tap, swapTimes } = useTimer({
    settings: settings.gameMode,
    handicap: settings.handicap,
    onByoyomiTick: handleByoyomiTick,
    onTimeUp: handleTimeUp,
    onConsiderationStart: handleConsiderationStart,
  });

  /**
   * 最初のインタラクション時に音声システムを初期化
   * ブラウザのオートプレイポリシー対応
   */
  const handleFirstInteraction = useCallback(() => {
    if (!isInitialized) {
      initSound();
      setIsInitialized(true);
    }
  }, [isInitialized, initSound]);

  // 対局開始時に音声再生
  useEffect(() => {
    if (
      state.isStarted &&
      state.activePlayer === 1 &&
      state.player1.moveCount === 0 &&
      state.player2.moveCount === 0
    ) {
      playStart();
    }
  }, [
    state.isStarted,
    state.activePlayer,
    state.player1.moveCount,
    state.player2.moveCount,
    playStart,
  ]);

  /**
   * タップ（着手）処理
   * ゲーム開始前なら開始、開始後なら手番交代
   */
  const handleTap = useCallback(() => {
    handleFirstInteraction();
    if (!state.isStarted) {
      start(1);
    } else {
      tap();
    }
  }, [handleFirstInteraction, state.isStarted, start, tap]);

  /**
   * プレイヤー1（下/先手/白）のタップ処理
   */
  const handlePlayer1Tap = useCallback(() => {
    if (!state.isStarted || state.activePlayer === 1) {
      handleTap();
    }
  }, [state.isStarted, state.activePlayer, handleTap]);

  /**
   * プレイヤー2（上/後手/黒）のタップ処理
   */
  const handlePlayer2Tap = useCallback(() => {
    if (!state.isStarted || state.activePlayer === 2) {
      handleTap();
    }
  }, [state.isStarted, state.activePlayer, handleTap]);

  return (
    <main
      className="h-full flex flex-col"
      role="application"
      aria-label="対局時計"
    >
      {/* スクリーンリーダー用のライブリージョン */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {state.isGameOver
          ? `ゲーム終了。${state.player1.isTimeUp ? "先手" : "後手"}の時間切れです。`
          : state.isStarted
            ? `${state.activePlayer === 1 ? "先手" : "後手"}の手番です。`
            : "対局開始前。画面をタップして開始してください。"}
      </div>

      {/* プレイヤー2（上部・180度回転） */}
      <TimerDisplay
        player={state.player2}
        settings={settings.gameMode}
        isActive={state.activePlayer === 2 && !state.isPaused}
        isReversed={true}
        playerLabel="後手 / 黒"
        playerNumber={2}
        onTap={handlePlayer2Tap}
      />

      {/* コントロールパネル */}
      <ControlPanel
        state={state}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSettings={onOpenSettings}
        onSwapTimes={swapTimes}
      />

      {/* プレイヤー1（下部） */}
      <TimerDisplay
        player={state.player1}
        settings={settings.gameMode}
        isActive={state.activePlayer === 1 && !state.isPaused}
        isReversed={false}
        playerLabel="先手 / 白"
        playerNumber={1}
        onTap={handlePlayer1Tap}
      />
    </main>
  );
}

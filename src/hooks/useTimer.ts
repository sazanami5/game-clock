/**
 * タイマーカスタムフック
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { TIMER_TICK_INTERVAL } from '../constants';
import {
  processTimeElapsed,
  processMove,
  resetTimerState,
  swapPlayerTimes,
} from '../utils/timerModes';
import type {
  TimerState,
  GameModeSettings,
  PlayerState,
  PlayerNumber,
  HandicapSettings,
} from '../types';

interface UseTimerOptions {
  readonly settings: GameModeSettings;
  readonly handicap?: HandicapSettings;
  readonly onByoyomiTick?: (player: PlayerNumber, seconds: number) => void;
  readonly onTimeUp?: (player: PlayerNumber) => void;
  readonly onConsiderationStart?: (player: PlayerNumber, remaining: number) => void;
}

interface UseTimerReturn {
  readonly state: TimerState;
  readonly start: (player?: PlayerNumber) => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly reset: () => void;
  readonly tap: () => void;
  readonly swapTimes: () => void;
}

export const useTimer = (options: UseTimerOptions): UseTimerReturn => {
  const { settings, handicap, onByoyomiTick, onTimeUp, onConsiderationStart } =
    options;

  const [state, setState] = useState<TimerState>(() =>
    resetTimerState(settings, handicap)
  );

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const lastByoyomiSecondRef = useRef<{
    player1: number;
    player2: number;
  }>({
    player1: -1,
    player2: -1,
  });

  // タイマーをクリア
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // タイマーのティック処理
  const tick = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTickRef.current;
    lastTickRef.current = now;

    setState((prevState) => {
      if (
        !prevState.activePlayer ||
        prevState.isPaused ||
        prevState.isGameOver
      ) {
        return prevState;
      }

      const playerKey =
        prevState.activePlayer === 1 ? 'player1' : 'player2';
      const currentPlayer = prevState[playerKey];

      // 時間経過を処理
      const newPlayerState = processTimeElapsed(
        currentPlayer,
        settings,
        delta
      );

      // 秒読みのコールバック
      if (newPlayerState.isInByoyomi && onByoyomiTick) {
        const seconds = Math.ceil(newPlayerState.remainingTime / 1000);
        const lastSecondKey = playerKey === 'player1' ? 'player1' : 'player2';
        if (
          seconds !== lastByoyomiSecondRef.current[lastSecondKey] &&
          seconds > 0 &&
          seconds <= 30
        ) {
          lastByoyomiSecondRef.current[lastSecondKey] = seconds;
          onByoyomiTick(prevState.activePlayer, seconds);
        }
      }

      // 考慮時間開始のコールバック
      if (
        newPlayerState.isInConsideration &&
        !currentPlayer.isInConsideration &&
        onConsiderationStart
      ) {
        onConsiderationStart(
          prevState.activePlayer,
          newPlayerState.considerationRemaining
        );
      }

      // 時間切れ判定
      if (newPlayerState.isTimeUp && !currentPlayer.isTimeUp) {
        if (onTimeUp) {
          onTimeUp(prevState.activePlayer);
        }
        return {
          ...prevState,
          [playerKey]: newPlayerState,
          isGameOver: true,
          activePlayer: null,
        };
      }

      return {
        ...prevState,
        [playerKey]: newPlayerState,
        elapsedTime: prevState.elapsedTime + delta,
      };
    });
  }, [settings, onByoyomiTick, onTimeUp, onConsiderationStart]);

  // タイマーを開始
  const startTimer = useCallback(() => {
    clearTimer();
    lastTickRef.current = performance.now();
    intervalRef.current = window.setInterval(tick, TIMER_TICK_INTERVAL);
  }, [clearTimer, tick]);

  // ゲーム開始
  const start = useCallback(
    (player: PlayerNumber = 1) => {
      setState((prevState) => ({
        ...prevState,
        isStarted: true,
        isPaused: false,
        activePlayer: player,
      }));
      startTimer();
    },
    [startTimer]
  );

  // 一時停止
  const pause = useCallback(() => {
    clearTimer();
    setState((prevState) => ({
      ...prevState,
      isPaused: true,
    }));
  }, [clearTimer]);

  // 再開
  const resume = useCallback(() => {
    setState((prevState) => {
      if (!prevState.isPaused || prevState.isGameOver) {
        return prevState;
      }
      return {
        ...prevState,
        isPaused: false,
      };
    });
    startTimer();
  }, [startTimer]);

  // リセット
  const reset = useCallback(() => {
    clearTimer();
    lastByoyomiSecondRef.current = { player1: -1, player2: -1 };
    setState(resetTimerState(settings, handicap));
  }, [clearTimer, settings, handicap]);

  // タップ（着手）
  const tap = useCallback(() => {
    setState((prevState) => {
      // ゲームが開始されていない場合は開始
      if (!prevState.isStarted) {
        return {
          ...prevState,
          isStarted: true,
          isPaused: false,
          activePlayer: 1,
        };
      }

      // 一時停止中またはゲーム終了の場合は何もしない
      if (
        prevState.isPaused ||
        prevState.isGameOver ||
        !prevState.activePlayer
      ) {
        return prevState;
      }

      const currentPlayerKey =
        prevState.activePlayer === 1 ? 'player1' : 'player2';
      const currentPlayer = prevState[currentPlayerKey] as PlayerState;

      // 着手を処理
      const newPlayerState = processMove(currentPlayer, settings);

      // 秒読みカウントをリセット
      const lastSecondKey =
        currentPlayerKey === 'player1' ? 'player1' : 'player2';
      lastByoyomiSecondRef.current[lastSecondKey] = -1;

      // プレイヤーを切り替え
      const nextPlayer: PlayerNumber = prevState.activePlayer === 1 ? 2 : 1;

      return {
        ...prevState,
        [currentPlayerKey]: newPlayerState,
        activePlayer: nextPlayer,
      };
    });
  }, [settings]);

  // 残時間入れ替え（千日手対応）
  const swapTimes = useCallback(() => {
    setState((prevState) => swapPlayerTimes(prevState));
  }, []);

  // 設定が変更されたらリセット
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, handicap]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    tap,
    swapTimes,
  };
};

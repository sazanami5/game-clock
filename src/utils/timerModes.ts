/**
 * タイマーモード関連のユーティリティ関数
 */

import {
  LOW_TIME_THRESHOLD,
  CRITICAL_TIME_THRESHOLD,
  SHOW_MILLIS_THRESHOLD,
} from '../constants';
import {
  createInitialPlayerState,
  type GameModeSettings,
  type PlayerState,
  type TimerState,
  type HandicapSettings,
} from '../types';

/**
 * 時間経過を処理し、新しいプレイヤー状態を返す
 */
export const processTimeElapsed = (
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState => {
  // すでに時間切れの場合は何もしない
  if (player.isTimeUp) {
    return player;
  }

  // 考慮時間中の場合（モード2）
  if (player.isInConsideration && settings.type === 'consideration') {
    return processConsiderationTime(player, settings, deltaMs);
  }

  // 秒読み中の場合
  if (player.isInByoyomi) {
    return processByoyomiTime(player, settings, deltaMs);
  }

  // 通常の持ち時間消費
  const newRemainingTime = player.remainingTime - deltaMs;

  if (newRemainingTime <= 0) {
    // 持ち時間が切れた
    const overflow = -newRemainingTime;
    return handleMainTimeExpired(player, settings, overflow);
  }

  return {
    ...player,
    remainingTime: newRemainingTime,
  };
};

/**
 * 持ち時間切れの処理
 */
const handleMainTimeExpired = (
  player: PlayerState,
  settings: GameModeSettings,
  overflow: number
): PlayerState => {
  switch (settings.type) {
    case 'basic':
    case 'byoyomi_multi':
    case 'consideration':
      // 秒読みがある場合は秒読みに移行
      if (settings.byoyomi > 0) {
        const byoyomiTime = settings.byoyomi * 1000 - overflow;
        if (byoyomiTime <= 0) {
          // 秒読み時間も使い切った
          return handleByoyomiExpired(player, settings);
        }
        return {
          ...player,
          isInByoyomi: true,
          remainingTime: byoyomiTime,
        };
      }
      // 秒読みなしの場合は時間切れ
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    case 'fischer':
      // フィッシャーモードは加算があるので持ち時間0で時間切れ
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    case 'canadian':
      // カナダ式は期間ごとの時間管理
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    case 'chess_intl':
    case 'xiangqi_intl':
      {
        // 規定手数前に時間切れ
        if (player.moveCount < settings.movesPerPeriod) {
          return {
            ...player,
            remainingTime: 0,
            isTimeUp: true,
          };
        }
        // 規定手数後は秒読みに移行
        const byoyomiTime = settings.byoyomi * 1000 - overflow;
        if (byoyomiTime <= 0) {
          return {
            ...player,
            remainingTime: 0,
            isTimeUp: true,
          };
        }
        return {
          ...player,
          isInByoyomi: true,
          remainingTime: byoyomiTime,
        };
      }
  }
};

/**
 * 秒読み時間の処理
 */
const processByoyomiTime = (
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState => {
  const newRemainingTime = player.remainingTime - deltaMs;

  if (newRemainingTime <= 0) {
    return handleByoyomiExpired(player, settings);
  }

  return {
    ...player,
    remainingTime: newRemainingTime,
  };
};

/**
 * 秒読み時間切れの処理
 */
const handleByoyomiExpired = (
  player: PlayerState,
  settings: GameModeSettings
): PlayerState => {
  switch (settings.type) {
    case 'basic':
      // 基本モードは秒読み1回なので時間切れ
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    case 'byoyomi_multi':
      // 秒読み複数回
      if (player.byoyomiRemaining > 1) {
        return {
          ...player,
          byoyomiRemaining: player.byoyomiRemaining - 1,
          remainingTime: settings.byoyomi * 1000,
        };
      }
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    case 'consideration':
      // 考慮時間に移行できるか確認
      if (player.considerationRemaining > 0) {
        return {
          ...player,
          isInByoyomi: false,
          isInConsideration: true,
          remainingTime: settings.considerationTime * 1000,
        };
      }
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };

    default:
      return {
        ...player,
        remainingTime: 0,
        isTimeUp: true,
      };
  }
};

/**
 * 考慮時間の処理
 */
const processConsiderationTime = (
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState => {
  const newRemainingTime = player.remainingTime - deltaMs;

  if (newRemainingTime <= 0) {
    // 考慮時間を1回消費
    const newConsiderationRemaining = player.considerationRemaining - 1;

    if (newConsiderationRemaining >= 0) {
      // まだ考慮時間が残っている場合、秒読みに戻る
      return {
        ...player,
        considerationRemaining: newConsiderationRemaining,
        isInConsideration: false,
        isInByoyomi: true,
        remainingTime: settings.byoyomi * 1000,
      };
    }
    // 考慮時間も使い切った
    return {
      ...player,
      considerationRemaining: newConsiderationRemaining,
      remainingTime: 0,
      isTimeUp: true,
    };
  }

  return {
    ...player,
    remainingTime: newRemainingTime,
  };
};

/**
 * 着手時の処理（タップ時に呼ばれる）
 */
export const processMove = (
  player: PlayerState,
  settings: GameModeSettings
): PlayerState => {
  const baseMoveState = {
    ...player,
    moveCount: player.moveCount + 1,
  };

  switch (settings.type) {
    case 'basic':
      // 秒読み中なら秒読みをリセット
      if (player.isInByoyomi) {
        return {
          ...baseMoveState,
          remainingTime: settings.byoyomi * 1000,
        };
      }
      return baseMoveState;

    case 'byoyomi_multi':
      // 秒読み中なら秒読みをリセット
      if (player.isInByoyomi) {
        return {
          ...baseMoveState,
          remainingTime: settings.byoyomi * 1000,
        };
      }
      return baseMoveState;

    case 'consideration':
      // 考慮時間中なら考慮時間を消費して秒読みに戻る
      if (player.isInConsideration) {
        return {
          ...baseMoveState,
          considerationRemaining: player.considerationRemaining - 1,
          isInConsideration: false,
          isInByoyomi: true,
          remainingTime: settings.byoyomi * 1000,
        };
      }
      if (player.isInByoyomi) {
        // 秒読み中なら秒読みをリセット
        return {
          ...baseMoveState,
          remainingTime: settings.byoyomi * 1000,
        };
      }
      return baseMoveState;

    case 'fischer':
      // 着手ごとに時間を加算
      return {
        ...baseMoveState,
        remainingTime: player.remainingTime + settings.increment * 1000,
      };

    case 'canadian':
      {
        // 期間内の手数をカウント
        const newMovesInPeriod = player.movesInPeriod + 1;
        if (newMovesInPeriod >= settings.movesPerPeriod) {
          // 規定手数達成で時間追加
          return {
            ...baseMoveState,
            remainingTime: player.remainingTime + settings.additionalTime * 1000,
            movesInPeriod: 0,
          };
        }
        return {
          ...baseMoveState,
          movesInPeriod: newMovesInPeriod,
        };
      }

    case 'chess_intl':
      {
        const newMoveCount = player.moveCount + 1;
        // 規定手数達成後の処理
        if (newMoveCount === settings.movesPerPeriod) {
          // 秒読みに移行
          return {
            ...baseMoveState,
            isInByoyomi: true,
            remainingTime: player.remainingTime + settings.increment * 1000,
          };
        }
        if (player.isInByoyomi) {
          // 着手ごとに加算
          return {
            ...baseMoveState,
            remainingTime: player.remainingTime + settings.increment * 1000,
          };
        }
        return baseMoveState;
      }

    case 'xiangqi_intl':
      {
        const newMoveCount = player.moveCount + 1;
        // 規定手数達成後は秒読み
        if (newMoveCount === settings.movesPerPeriod) {
          return {
            ...baseMoveState,
            isInByoyomi: true,
            remainingTime: settings.byoyomi * 1000,
          };
        }
        if (player.isInByoyomi) {
          return {
            ...baseMoveState,
            remainingTime: settings.byoyomi * 1000,
          };
        }
        return baseMoveState;
      }
  }
};

/**
 * タイマー状態をリセット
 */
export const resetTimerState = (
  settings: GameModeSettings,
  handicap?: HandicapSettings
): TimerState => {
  const player1 = createInitialPlayerState(settings);
  const player2 = createInitialPlayerState(settings);

  // ハンデ設定を適用
  if (handicap?.enabled) {
    return {
      player1: {
        ...player1,
        remainingTime: handicap.player1Time * 1000,
      },
      player2: {
        ...player2,
        remainingTime: handicap.player2Time * 1000,
      },
      activePlayer: null,
      isStarted: false,
      isPaused: false,
      isGameOver: false,
      elapsedTime: 0,
    };
  }

  return {
    player1,
    player2,
    activePlayer: null,
    isStarted: false,
    isPaused: false,
    isGameOver: false,
    elapsedTime: 0,
  };
};

/**
 * プレイヤーの残時間を入れ替える（千日手対応）
 */
export const swapPlayerTimes = (state: TimerState): TimerState => ({
  ...state,
  player1: {
    ...state.player1,
    remainingTime: state.player2.remainingTime,
  },
  player2: {
    ...state.player2,
    remainingTime: state.player1.remainingTime,
  },
});

/**
 * ミリ秒を表示用の文字列に変換
 * @param ms ミリ秒
 * @param showMillis 0.1秒単位で表示するかどうか
 * @returns フォーマットされた時間文字列
 */
export const formatTime = (ms: number, showMillis = false): string => {
  const safeMs = Math.max(0, ms);

  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((safeMs % 1000) / 100);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (showMillis && safeMs < SHOW_MILLIS_THRESHOLD) {
    // 1分未満の場合は0.1秒単位で表示
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 残り時間が少ない状態かどうかを判定
 */
export const isLowTime = (remainingTime: number): boolean =>
  remainingTime < LOW_TIME_THRESHOLD && remainingTime > 0;

/**
 * 残り時間が非常に少ない状態かどうかを判定
 */
export const isCriticalTime = (remainingTime: number): boolean =>
  remainingTime < CRITICAL_TIME_THRESHOLD && remainingTime > 0;

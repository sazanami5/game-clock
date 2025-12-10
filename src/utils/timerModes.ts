import { GameModeSettings, PlayerState, TimerState, createInitialPlayerState } from '../types';

// 時間経過を処理し、新しいプレイヤー状態を返す
export function processTimeElapsed(
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState {
  const newState = { ...player };
  
  // すでに時間切れの場合は何もしない
  if (player.isTimeUp) {
    return newState;
  }

  // 考慮時間中の場合（モード2）
  if (player.isInConsideration && settings.type === 'consideration') {
    return processConsiderationTime(newState, settings, deltaMs);
  }

  // 秒読み中の場合
  if (player.isInByoyomi) {
    return processByoyomiTime(newState, settings, deltaMs);
  }

  // 通常の持ち時間消費
  newState.remainingTime -= deltaMs;

  if (newState.remainingTime <= 0) {
    // 持ち時間が切れた
    const overflow = -newState.remainingTime;
    
    switch (settings.type) {
      case 'basic':
      case 'byoyomi_multi':
      case 'consideration':
        // 秒読みがある場合は秒読みに移行
        if (settings.byoyomi > 0) {
          newState.isInByoyomi = true;
          newState.remainingTime = settings.byoyomi * 1000 - overflow;
          if (newState.remainingTime <= 0) {
            // 秒読み時間も使い切った
            return handleByoyomiExpired(newState, settings);
          }
        } else {
          // 秒読みなしの場合は時間切れ
          newState.remainingTime = 0;
          newState.isTimeUp = true;
        }
        break;

      case 'fischer':
        // フィッシャーモードは加算があるので持ち時間0で時間切れ
        newState.remainingTime = 0;
        newState.isTimeUp = true;
        break;

      case 'canadian':
        // カナダ式は期間ごとの時間管理
        newState.remainingTime = 0;
        newState.isTimeUp = true;
        break;

      case 'chess_intl':
      case 'xiangqi_intl':
        // 規定手数前に時間切れ
        if (newState.moveCount < settings.movesPerPeriod) {
          newState.remainingTime = 0;
          newState.isTimeUp = true;
        } else {
          // 規定手数後は秒読みに移行
          newState.isInByoyomi = true;
          newState.remainingTime = settings.byoyomi * 1000 - overflow;
          if (newState.remainingTime <= 0) {
            newState.remainingTime = 0;
            newState.isTimeUp = true;
          }
        }
        break;
    }
  }

  return newState;
}

// 秒読み時間の処理
function processByoyomiTime(
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState {
  const newState = { ...player };
  newState.remainingTime -= deltaMs;

  if (newState.remainingTime <= 0) {
    return handleByoyomiExpired(newState, settings);
  }

  return newState;
}

// 秒読み時間切れの処理
function handleByoyomiExpired(
  player: PlayerState,
  settings: GameModeSettings
): PlayerState {
  const newState = { ...player };

  switch (settings.type) {
    case 'basic':
      // 基本モードは秒読み1回なので時間切れ
      newState.remainingTime = 0;
      newState.isTimeUp = true;
      break;

    case 'byoyomi_multi':
      // 秒読み複数回
      if (newState.byoyomiRemaining > 1) {
        newState.byoyomiRemaining -= 1;
        newState.remainingTime = settings.byoyomi * 1000;
      } else {
        newState.remainingTime = 0;
        newState.isTimeUp = true;
      }
      break;

    case 'consideration':
      // 考慮時間に移行できるか確認
      if (newState.considerationRemaining > 0) {
        newState.isInByoyomi = false;
        newState.isInConsideration = true;
        newState.remainingTime = settings.considerationTime * 1000;
      } else {
        newState.remainingTime = 0;
        newState.isTimeUp = true;
      }
      break;

    default:
      newState.remainingTime = 0;
      newState.isTimeUp = true;
      break;
  }

  return newState;
}

// 考慮時間の処理
function processConsiderationTime(
  player: PlayerState,
  settings: GameModeSettings,
  deltaMs: number
): PlayerState {
  const newState = { ...player };
  newState.remainingTime -= deltaMs;

  if (newState.remainingTime <= 0) {
    // 考慮時間を1回消費
    newState.considerationRemaining -= 1;
    
    if (newState.considerationRemaining >= 0) {
      // まだ考慮時間が残っている場合、秒読みに戻る
      newState.isInConsideration = false;
      newState.isInByoyomi = true;
      newState.remainingTime = settings.byoyomi * 1000;
    } else {
      // 考慮時間も使い切った
      newState.remainingTime = 0;
      newState.isTimeUp = true;
    }
  }

  return newState;
}

// 着手時の処理（タップ時に呼ばれる）
export function processMove(
  player: PlayerState,
  settings: GameModeSettings
): PlayerState {
  const newState = { ...player };
  newState.moveCount += 1;

  switch (settings.type) {
    case 'basic':
      // 秒読み中なら秒読みをリセット
      if (newState.isInByoyomi) {
        newState.remainingTime = settings.byoyomi * 1000;
      }
      break;

    case 'byoyomi_multi':
      // 秒読み中なら秒読みをリセット
      if (newState.isInByoyomi) {
        newState.remainingTime = settings.byoyomi * 1000;
      }
      break;

    case 'consideration':
      // 考慮時間中なら考慮時間を消費して秒読みに戻る
      if (newState.isInConsideration) {
        newState.considerationRemaining -= 1;
        newState.isInConsideration = false;
        newState.isInByoyomi = true;
        newState.remainingTime = settings.byoyomi * 1000;
      } else if (newState.isInByoyomi) {
        // 秒読み中なら秒読みをリセット
        newState.remainingTime = settings.byoyomi * 1000;
      }
      break;

    case 'fischer':
      // 着手ごとに時間を加算
      newState.remainingTime += settings.increment * 1000;
      break;

    case 'canadian':
      // 期間内の手数をカウント
      newState.movesInPeriod += 1;
      if (newState.movesInPeriod >= settings.movesPerPeriod) {
        // 規定手数達成で時間追加
        newState.remainingTime += settings.additionalTime * 1000;
        newState.movesInPeriod = 0;
      }
      break;

    case 'chess_intl':
      // 規定手数達成後の処理
      if (newState.moveCount === settings.movesPerPeriod) {
        // 秒読みに移行
        newState.isInByoyomi = true;
      }
      if (newState.isInByoyomi) {
        // 着手ごとに加算
        newState.remainingTime += settings.increment * 1000;
      }
      break;

    case 'xiangqi_intl':
      // 規定手数達成後は秒読み
      if (newState.moveCount === settings.movesPerPeriod) {
        newState.isInByoyomi = true;
      }
      if (newState.isInByoyomi) {
        newState.remainingTime = settings.byoyomi * 1000;
      }
      break;
  }

  return newState;
}

// タイマー状態をリセット
export function resetTimerState(
  settings: GameModeSettings,
  handicap?: { enabled: boolean; player1Time: number; player2Time: number }
): TimerState {
  const player1 = createInitialPlayerState(settings);
  const player2 = createInitialPlayerState(settings);

  // ハンデ設定を適用
  if (handicap?.enabled) {
    player1.remainingTime = handicap.player1Time * 1000;
    player2.remainingTime = handicap.player2Time * 1000;
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
}

// プレイヤーの残時間を入れ替える（千日手対応）
export function swapPlayerTimes(state: TimerState): TimerState {
  return {
    ...state,
    player1: {
      ...state.player1,
      remainingTime: state.player2.remainingTime,
    },
    player2: {
      ...state.player2,
      remainingTime: state.player1.remainingTime,
    },
  };
}

// 時間を修正する
export function adjustTime(
  player: PlayerState,
  adjustmentMs: number
): PlayerState {
  return {
    ...player,
    remainingTime: Math.max(0, player.remainingTime + adjustmentMs),
  };
}

// ミリ秒を表示用の文字列に変換
export function formatTime(ms: number, showMillis: boolean = false): string {
  if (ms < 0) ms = 0;
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 100);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  if (showMillis && ms < 60000) {
    // 1分未満の場合は0.1秒単位で表示
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 残り時間から秒読みカウント用の秒数を取得
export function getByoyomiSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}


// ゲームモードの種類
export type GameModeType =
  | 'basic'           // 基本: 切れ負け/秒読み
  | 'byoyomi_multi'   // モード1: 秒読み複数回
  | 'consideration'   // モード2: 考慮時間（NHK杯ルール）
  | 'fischer'         // モード3: フィッシャー
  | 'canadian'        // モード4: カナダ式
  | 'chess_intl'      // モード5: チェス国際
  | 'xiangqi_intl';   // モード6: シャンチー国際

// ゲームモードの設定
export interface GameModeSettings {
  type: GameModeType;
  // 持ち時間（秒）
  mainTime: number;
  // 秒読み時間（秒）
  byoyomi: number;
  // 秒読み回数（モード1用）
  byoyomiCount: number;
  // 考慮時間（秒）（モード2用）
  considerationTime: number;
  // 考慮時間回数（モード2用）
  considerationCount: number;
  // フィッシャー加算時間（秒）（モード3, 5用）
  increment: number;
  // 規定手数（モード4, 5, 6用）
  movesPerPeriod: number;
  // 追加時間（秒）（モード4用）
  additionalTime: number;
}

// プレイヤーの状態
export interface PlayerState {
  // 残り持ち時間（ミリ秒）
  remainingTime: number;
  // 残り秒読み回数
  byoyomiRemaining: number;
  // 残り考慮時間回数
  considerationRemaining: number;
  // 現在秒読み中かどうか
  isInByoyomi: boolean;
  // 現在考慮時間中かどうか
  isInConsideration: boolean;
  // 手数
  moveCount: number;
  // 時間切れかどうか
  isTimeUp: boolean;
  // 現在の期間での手数（カナダ式用）
  movesInPeriod: number;
}

// タイマーの状態
export interface TimerState {
  // プレイヤー1（上/先手/白）の状態
  player1: PlayerState;
  // プレイヤー2（下/後手/黒）の状態
  player2: PlayerState;
  // 現在アクティブなプレイヤー（1 or 2, null = 停止中）
  activePlayer: 1 | 2 | null;
  // ゲームが開始されたかどうか
  isStarted: boolean;
  // 一時停止中かどうか
  isPaused: boolean;
  // ゲームが終了したかどうか
  isGameOver: boolean;
  // 総経過時間（ミリ秒）
  elapsedTime: number;
}

// 音声設定
export type VoiceType = 'japanese' | 'english' | 'buzzer' | 'none';

// 音量レベル
export type VolumeLevel = 0 | 1 | 2 | 3;

// 音声設定
export interface SoundSettings {
  voiceType: VoiceType;
  volume: VolumeLevel;
}

// アプリケーション設定
export interface AppSettings {
  // ゲームモード設定
  gameMode: GameModeSettings;
  // 音声設定
  sound: SoundSettings;
  // ハンデ設定（プレイヤー2の持ち時間調整、秒単位）
  handicap: {
    enabled: boolean;
    player1Time: number;
    player2Time: number;
  };
}

// プリセット設定
export interface Preset {
  id: string;
  name: string;
  description: string;
  settings: GameModeSettings;
}

// デフォルトのプレイヤー状態を作成
export function createInitialPlayerState(settings: GameModeSettings): PlayerState {
  return {
    remainingTime: settings.mainTime * 1000,
    byoyomiRemaining: settings.byoyomiCount,
    considerationRemaining: settings.considerationCount,
    isInByoyomi: false,
    isInConsideration: false,
    moveCount: 0,
    isTimeUp: false,
    movesInPeriod: 0,
  };
}

// デフォルトのタイマー状態を作成
export function createInitialTimerState(settings: GameModeSettings): TimerState {
  return {
    player1: createInitialPlayerState(settings),
    player2: createInitialPlayerState(settings),
    activePlayer: null,
    isStarted: false,
    isPaused: false,
    isGameOver: false,
    elapsedTime: 0,
  };
}

// デフォルトのゲームモード設定
export const defaultGameModeSettings: GameModeSettings = {
  type: 'basic',
  mainTime: 600, // 10分
  byoyomi: 30,   // 30秒
  byoyomiCount: 1,
  considerationTime: 60,
  considerationCount: 10,
  increment: 5,
  movesPerPeriod: 40,
  additionalTime: 60,
};

// デフォルトの音声設定
export const defaultSoundSettings: SoundSettings = {
  voiceType: 'japanese',
  volume: 2,
};

// デフォルトのアプリ設定
export const defaultAppSettings: AppSettings = {
  gameMode: defaultGameModeSettings,
  sound: defaultSoundSettings,
  handicap: {
    enabled: false,
    player1Time: 600,
    player2Time: 600,
  },
};


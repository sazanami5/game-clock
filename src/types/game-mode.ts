/**
 * ゲームモード関連の型定義
 */

/** ゲームモードの種類 */
export type GameModeType =
  | 'basic' // 基本: 切れ負け/秒読み
  | 'byoyomi_multi' // モード1: 秒読み複数回
  | 'consideration' // モード2: 考慮時間（NHK杯ルール）
  | 'fischer' // モード3: フィッシャー
  | 'canadian' // モード4: カナダ式
  | 'chess_intl' // モード5: チェス国際
  | 'xiangqi_intl'; // モード6: シャンチー国際

/** ゲームモードの設定 */
export interface GameModeSettings {
  readonly type: GameModeType;
  /** 持ち時間（秒） */
  readonly mainTime: number;
  /** 秒読み時間（秒） */
  readonly byoyomi: number;
  /** 秒読み回数（モード1用） */
  readonly byoyomiCount: number;
  /** 考慮時間（秒）（モード2用） */
  readonly considerationTime: number;
  /** 考慮時間回数（モード2用） */
  readonly considerationCount: number;
  /** フィッシャー加算時間（秒）（モード3, 5用） */
  readonly increment: number;
  /** 規定手数（モード4, 5, 6用） */
  readonly movesPerPeriod: number;
  /** 追加時間（秒）（モード4用） */
  readonly additionalTime: number;
}

/** デフォルトのゲームモード設定 */
export const DEFAULT_GAME_MODE_SETTINGS: Readonly<GameModeSettings> = {
  type: 'basic',
  mainTime: 600, // 10分
  byoyomi: 30, // 30秒
  byoyomiCount: 1,
  considerationTime: 60,
  considerationCount: 10,
  increment: 5,
  movesPerPeriod: 40,
  additionalTime: 60,
} as const;

/** プリセット設定 */
export interface Preset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly settings: GameModeSettings;
}

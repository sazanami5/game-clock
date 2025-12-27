/**
 * 音声・音響関連のユーティリティ
 */

import {
  DEFAULT_BUZZER_FREQUENCY,
  SHORT_BEEP_DURATION,
  LONG_BEEP_DURATION,
  CONTINUOUS_BEEP_DURATION,
  BYOYOMI_CONTINUOUS_START,
  LOCALE_JAPANESE,
  LOCALE_ENGLISH,
  SPEECH_RATE_NORMAL,
  SPEECH_RATE_FAST,
} from '../constants';
import type { VoiceType, VolumeLevel, PlayerNumber } from '../types';

/** AudioContextのキャッシュ */
let audioContext: AudioContext | null = null;

/** 現在再生中の連続ブザー音（手番切り替え時に停止するため） */
let currentOscillator: OscillatorNode | null = null;

/** 音声リストのキャッシュ */
let cachedVoices: SpeechSynthesisVoice[] = [];

/** 音声合成が初期化済みかどうか */
let speechInitialized = false;

/**
 * AudioContextを取得（遅延初期化）
 */
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

/**
 * 音声リストを更新
 */
const updateVoices = (): void => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
};

/**
 * 音声を取得（キャッシュを使用）
 */
const getVoice = (lang: string): SpeechSynthesisVoice | null => {
  if (cachedVoices.length === 0) {
    updateVoices();
  }
  return cachedVoices.find((v) => v.lang.startsWith(lang)) ?? null;
};

/**
 * 音声合成を実行（共通処理）
 */
const speak = (
  text: string,
  lang: string,
  rate: number,
  volume: VolumeLevel
): void => {
  if (!('speechSynthesis' in window)) {
    return;
  }

  if (!speechInitialized) {
    initSpeechSynthesis();
  }

  const synth = window.speechSynthesis;

  if (synth.paused) {
    synth.resume();
  }

  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.volume = volume / 3;

  const targetLang = lang.startsWith('ja') ? 'ja' : 'en';
  const voice = getVoice(targetLang);
  if (voice) {
    utterance.voice = voice;
  }

  // Chrome bug workaround: cancel直後にspeakすると失敗することがある
  requestAnimationFrame(() => {
    synth.speak(utterance);
  });
};

/**
 * 連続ブザー音を停止
 */
export const stopBuzzer = (): void => {
  if (currentOscillator) {
    try {
      currentOscillator.stop();
    } catch {
      // 既に停止している場合は無視
    }
    currentOscillator = null;
  }
};

/**
 * ブザー音を再生
 */
export const playBuzzer = (
  volume: VolumeLevel,
  frequency: number = DEFAULT_BUZZER_FREQUENCY,
  duration: number = SHORT_BEEP_DURATION,
  persistent = false
): void => {
  if (volume === 0) return;

  if (persistent) {
    stopBuzzer();
  }

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const volumeValue = volume / 3;
    gainNode.gain.value = volumeValue * 0.5;

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

    if (persistent) {
      currentOscillator = oscillator;
      oscillator.onended = () => {
        if (currentOscillator === oscillator) {
          currentOscillator = null;
        }
      };
    }
  } catch (error) {
    console.error('Buzzer playback failed:', error);
  }
};

/**
 * 日本語の秒読みテキストを生成
 * 10秒前から「1、2、3、4、5、6、7、8、9、時間切れです」とカウントアップ
 */
const getJapaneseByoyomiText = (seconds: number): string => {
  if (seconds <= 1) return '時間切れです';
  if (seconds <= 10) {
    const count = 11 - seconds;
    return `${count}`;
  }
  if (seconds === 20) return '20秒';
  if (seconds === 30) return '30秒';
  return `${seconds}秒`;
};

/**
 * 英語の秒読みテキストを生成
 * 10秒前から「1、2、3、4、5、6、7、8、9、time's up」とカウントアップ
 */
const getEnglishByoyomiText = (seconds: number): string => {
  if (seconds <= 1) return "time's up";
  if (seconds <= 10) {
    const count = 11 - seconds;
    return `${count}`;
  }
  if (seconds === 20) return '20 seconds';
  if (seconds === 30) return '30 seconds';
  return `${seconds}`;
};

/**
 * 秒読み音声を話す
 */
export const speakByoyomi = (
  seconds: number,
  voiceType: VoiceType,
  volume: VolumeLevel
): void => {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    if (seconds <= BYOYOMI_CONTINUOUS_START) {
      if (seconds === BYOYOMI_CONTINUOUS_START) {
        playBuzzer(
          volume,
          DEFAULT_BUZZER_FREQUENCY,
          CONTINUOUS_BEEP_DURATION,
          true
        );
      }
      return;
    }
    playBuzzer(volume, DEFAULT_BUZZER_FREQUENCY, SHORT_BEEP_DURATION);
    return;
  }

  const text =
    voiceType === 'japanese'
      ? getJapaneseByoyomiText(seconds)
      : getEnglishByoyomiText(seconds);

  const lang = voiceType === 'japanese' ? LOCALE_JAPANESE : LOCALE_ENGLISH;
  speak(text, lang, SPEECH_RATE_FAST, volume);
};

/**
 * 開始時の音声
 */
export const speakStart = (voiceType: VoiceType, volume: VolumeLevel): void => {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 660, LONG_BEEP_DURATION);
    return;
  }

  const text =
    voiceType === 'japanese'
      ? 'よろしくお願いします'
      : "Let's start the game";

  const lang = voiceType === 'japanese' ? LOCALE_JAPANESE : LOCALE_ENGLISH;
  speak(text, lang, SPEECH_RATE_NORMAL, volume);
};

/**
 * 終了時の音声
 */
export const speakTimeUp = (
  player: PlayerNumber,
  voiceType: VoiceType,
  volume: VolumeLevel
): void => {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 440, 0.5);
    setTimeout(() => playBuzzer(volume, 440, 0.5), 600);
    return;
  }

  const playerName =
    voiceType === 'japanese'
      ? player === 1
        ? '先手'
        : '後手'
      : player === 1
      ? 'Player one'
      : 'Player two';

  const text =
    voiceType === 'japanese'
      ? `${playerName}、時間切れです`
      : `${playerName}, time is up`;

  const lang = voiceType === 'japanese' ? LOCALE_JAPANESE : LOCALE_ENGLISH;
  speak(text, lang, SPEECH_RATE_NORMAL, volume);
};

/**
 * 考慮時間使用時の音声
 */
export const speakConsideration = (
  remaining: number,
  voiceType: VoiceType,
  volume: VolumeLevel
): void => {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 550, 0.2);
    return;
  }

  const text =
    voiceType === 'japanese'
      ? `考慮時間、残り${remaining}回`
      : `Consideration time, ${remaining} remaining`;

  const lang = voiceType === 'japanese' ? LOCALE_JAPANESE : LOCALE_ENGLISH;
  speak(text, lang, SPEECH_RATE_FAST, volume);
};

/**
 * 音声合成の初期化（ユーザー操作後に呼ぶ）
 */
export const initSpeechSynthesis = (): void => {
  if (speechInitialized) return;

  if ('speechSynthesis' in window) {
    updateVoices();

    window.speechSynthesis.onvoiceschanged = () => {
      updateVoices();
    };

    window.speechSynthesis.cancel();

    speechInitialized = true;
  }
  getAudioContext();
};

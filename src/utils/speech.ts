import { VoiceType, VolumeLevel } from '../types';

// AudioContextのキャッシュ
let audioContext: AudioContext | null = null;

// AudioContextを取得（遅延初期化）
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// ブザー音を再生
export function playBuzzer(volume: VolumeLevel, frequency: number = 880, duration: number = 0.15): void {
  if (volume === 0) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // 音量を設定（0-3を0-1に変換）
    const volumeValue = volume / 3;
    gainNode.gain.value = volumeValue * 0.5;

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('Buzzer playback failed:', e);
  }
}

// 秒読み音声を話す
export function speakByoyomi(
  seconds: number,
  voiceType: VoiceType,
  volume: VolumeLevel
): void {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    // ブザー音
    playBuzzer(volume);
    return;
  }

  // Web Speech Synthesis API
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // 既存の発話をキャンセル
  window.speechSynthesis.cancel();

  const text = voiceType === 'japanese' 
    ? getJapaneseByoyomiText(seconds)
    : getEnglishByoyomiText(seconds);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  utterance.rate = 1.2; // 少し早めに
  utterance.volume = volume / 3;

  // 適切な音声を選択
  const voices = window.speechSynthesis.getVoices();
  const targetLang = voiceType === 'japanese' ? 'ja' : 'en';
  const voice = voices.find(v => v.lang.startsWith(targetLang));
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

// 日本語の秒読みテキストを生成
function getJapaneseByoyomiText(seconds: number): string {
  if (seconds <= 0) return '時間です';
  if (seconds <= 10) return `${seconds}`;
  if (seconds === 20) return '20';
  if (seconds === 30) return '30';
  return `${seconds}秒`;
}

// 英語の秒読みテキストを生成
function getEnglishByoyomiText(seconds: number): string {
  if (seconds <= 0) return 'Time';
  return `${seconds}`;
}

// 開始時の音声
export function speakStart(voiceType: VoiceType, volume: VolumeLevel): void {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 660, 0.3);
    return;
  }

  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const text = voiceType === 'japanese' 
    ? 'よろしくお願いします'
    : "Let's start the game";

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  utterance.rate = 1.0;
  utterance.volume = volume / 3;

  window.speechSynthesis.speak(utterance);
}

// 終了時の音声
export function speakTimeUp(
  player: 1 | 2,
  voiceType: VoiceType,
  volume: VolumeLevel
): void {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    // 連続ブザー
    playBuzzer(volume, 440, 0.5);
    setTimeout(() => playBuzzer(volume, 440, 0.5), 600);
    return;
  }

  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  // プレイヤー名を取得
  const playerName = voiceType === 'japanese'
    ? (player === 1 ? '先手' : '後手')
    : (player === 1 ? 'Player one' : 'Player two');

  const text = voiceType === 'japanese' 
    ? `${playerName}、時間切れです`
    : `${playerName}, time is up`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  utterance.rate = 1.0;
  utterance.volume = volume / 3;

  window.speechSynthesis.speak(utterance);
}

// 考慮時間使用時の音声
export function speakConsideration(
  remaining: number,
  voiceType: VoiceType,
  volume: VolumeLevel
): void {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 550, 0.2);
    return;
  }

  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const text = voiceType === 'japanese' 
    ? `考慮時間、残り${remaining}回`
    : `Consideration time, ${remaining} remaining`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  utterance.rate = 1.2;
  utterance.volume = volume / 3;

  window.speechSynthesis.speak(utterance);
}

// 音声合成の初期化（ユーザー操作後に呼ぶ）
export function initSpeechSynthesis(): void {
  if ('speechSynthesis' in window) {
    // 音声リストを読み込む
    window.speechSynthesis.getVoices();
  }
  // AudioContextを初期化
  getAudioContext();
}


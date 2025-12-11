import { VoiceType, VolumeLevel } from '../types';

// AudioContextのキャッシュ
let audioContext: AudioContext | null = null;

// 現在再生中の連続ブザー音（手番切り替え時に停止するため）
let currentOscillator: OscillatorNode | null = null;

// 音声リストのキャッシュ
let cachedVoices: SpeechSynthesisVoice[] = [];

// 音声合成が初期化済みかどうか
let speechInitialized = false;

// AudioContextを取得（遅延初期化）
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// 音声リストを更新
function updateVoices(): void {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
}

// 音声を取得（キャッシュを使用）
function getVoice(lang: string): SpeechSynthesisVoice | null {
  // キャッシュが空なら再取得
  if (cachedVoices.length === 0) {
    updateVoices();
  }
  return cachedVoices.find(v => v.lang.startsWith(lang)) || null;
}

// 音声合成を実行（共通処理）
function speak(text: string, lang: string, rate: number, volume: VolumeLevel): void {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // 初期化されていない場合は初期化
  if (!speechInitialized) {
    initSpeechSynthesis();
  }

  const synth = window.speechSynthesis;

  // 中断状態を解除
  if (synth.paused) {
    synth.resume();
  }

  // 発話中または保留中の場合はキャンセル
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.volume = volume / 3;

  // 適切な音声を選択
  const targetLang = lang.startsWith('ja') ? 'ja' : 'en';
  const voice = getVoice(targetLang);
  if (voice) {
    utterance.voice = voice;
  }

  // Chrome bug workaround: cancel直後にspeakすると失敗することがある
  // requestAnimationFrameで次のフレームまで待つ
  requestAnimationFrame(() => {
    synth.speak(utterance);
  });
}

// 連続ブザー音を停止
export function stopBuzzer(): void {
  if (currentOscillator) {
    try {
      currentOscillator.stop();
    } catch {
      // 既に停止している場合は無視
    }
    currentOscillator = null;
  }
}

// ブザー音を再生
export function playBuzzer(volume: VolumeLevel, frequency: number = 880, duration: number = 0.15, persistent: boolean = false): void {
  if (volume === 0) return;

  // 連続音の場合は既存の音を停止
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

    // 音量を設定（0-3を0-1に変換）
    const volumeValue = volume / 3;
    gainNode.gain.value = volumeValue * 0.5;

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

    // 連続音の場合は参照を保持（手番切り替え時に停止できるように）
    if (persistent) {
      currentOscillator = oscillator;
      // 自然終了時にクリア
      oscillator.onended = () => {
        if (currentOscillator === oscillator) {
          currentOscillator = null;
        }
      };
    }
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
    if (seconds <= 5) {
      // 5秒以下: 5秒の時だけ長い連続音を開始（5秒間鳴り続ける）
      if (seconds === 5) {
        playBuzzer(volume, 880, 5.0, true); // persistent: true で手番切り替え時に停止可能
      }
      // 4〜1秒では新しい音を鳴らさない（5秒で開始した音が続く）
      return;
    }
    // 6〜10秒: 短い「ぴっ」という音
    playBuzzer(volume, 880, 0.15);
    return;
  }

  const text = voiceType === 'japanese' 
    ? getJapaneseByoyomiText(seconds)
    : getEnglishByoyomiText(seconds);

  const lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  speak(text, lang, 1.2, volume);
}

// 日本語の秒読みテキストを生成
// 10秒前から「1、2、3、4、5、6、7、8、9、時間切れです」とカウントアップ
function getJapaneseByoyomiText(seconds: number): string {
  if (seconds <= 1) return '時間切れです';
  // 残り10秒→1、残り9秒→2、... 残り2秒→9
  if (seconds <= 10) {
    const count = 11 - seconds;
    return `${count}`;
  }
  if (seconds === 20) return '20秒';
  if (seconds === 30) return '30秒';
  return `${seconds}秒`;
}

// 英語の秒読みテキストを生成
// 10秒前から「1、2、3、4、5、6、7、8、9、time's up」とカウントアップ
function getEnglishByoyomiText(seconds: number): string {
  if (seconds <= 1) return "time's up";
  // 残り10秒→1、残り9秒→2、... 残り2秒→9
  if (seconds <= 10) {
    const count = 11 - seconds;
    return `${count}`;
  }
  if (seconds === 20) return '20 seconds';
  if (seconds === 30) return '30 seconds';
  return `${seconds}`;
}

// 開始時の音声
export function speakStart(voiceType: VoiceType, volume: VolumeLevel): void {
  if (volume === 0 || voiceType === 'none') return;

  if (voiceType === 'buzzer') {
    playBuzzer(volume, 660, 0.3);
    return;
  }

  const text = voiceType === 'japanese' 
    ? 'よろしくお願いします'
    : "Let's start the game";

  const lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  speak(text, lang, 1.0, volume);
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

  // プレイヤー名を取得
  const playerName = voiceType === 'japanese'
    ? (player === 1 ? '先手' : '後手')
    : (player === 1 ? 'Player one' : 'Player two');

  const text = voiceType === 'japanese' 
    ? `${playerName}、時間切れです`
    : `${playerName}, time is up`;

  const lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  speak(text, lang, 1.0, volume);
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

  const text = voiceType === 'japanese' 
    ? `考慮時間、残り${remaining}回`
    : `Consideration time, ${remaining} remaining`;

  const lang = voiceType === 'japanese' ? 'ja-JP' : 'en-US';
  speak(text, lang, 1.2, volume);
}

// 音声合成の初期化（ユーザー操作後に呼ぶ）
export function initSpeechSynthesis(): void {
  if (speechInitialized) return;

  if ('speechSynthesis' in window) {
    // 音声リストを読み込んでキャッシュ
    updateVoices();
    
    // 音声リストが非同期で読み込まれる場合に備える
    window.speechSynthesis.onvoiceschanged = () => {
      updateVoices();
    };

    // 中断状態をクリア
    window.speechSynthesis.cancel();

    speechInitialized = true;
  }
  // AudioContextを初期化
  getAudioContext();
}


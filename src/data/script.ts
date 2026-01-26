import { CharacterId } from "../config";

// アニメーションの型定義
export type AnimationType = "none" | "fadeIn" | "slideUp" | "slideLeft" | "zoomIn" | "bounce";

// ビジュアルの型定義
export interface VisualContent {
  type: "image" | "text" | "none";
  // 画像の場合: public/content/からの相対パス（例: "screenshot.png"）
  src?: string;
  // テキストの場合: 表示するテキスト
  text?: string;
  // テキストのスタイル
  fontSize?: number;
  color?: string;
  // 表示アニメーション（デフォルト: fadeIn）
  animation?: AnimationType;
}

// 効果音の型定義
export interface SoundEffect {
  // public/se/からの相対パス（例: "chime.mp3"）
  src: string;
  // 音量（0-1）
  volume?: number;
}

// BGM設定
export interface BGMConfig {
  // public/bgm/からの相対パス（例: "background.mp3"）
  src: string;
  // 音量（0-1）
  volume?: number;
  // ループするか
  loop?: boolean;
}

// BGM設定（動画全体で使用）
// 使用しない場合はnullまたはコメントアウト
export const bgmConfig: BGMConfig | null = null;
// 例:
// export const bgmConfig: BGMConfig = {
//   src: "background.mp3",
//   volume: 0.3,
//   loop: true,
// };

// セリフデータの型定義
export interface ScriptLine {
  id: number;
  character: CharacterId;
  text: string; // 音声生成用（カタカナ可）
  displayText?: string; // 字幕表示用（英語表記など）。なければtextを使用
  scene: number;
  voiceFile: string;
  durationInFrames: number; // fps * playbackRate基準
  pauseAfter: number; // セリフ後の間（フレーム数）
  emotion?: "normal" | "happy" | "surprised" | "thinking" | "sad";
  // コンテンツエリアに表示するビジュアル
  visual?: VisualContent;
  // セリフ開始時に再生する効果音
  se?: SoundEffect;
}

// シーン定義
export interface SceneInfo {
  id: number;
  title: string;
  background: string;
}

// サンプルシーン定義
export const scenes: SceneInfo[] = [
  { id: 1, title: "オープニング", background: "gradient" },
  { id: 2, title: "メインコンテンツ", background: "solid" },
  { id: 3, title: "エンディング", background: "gradient" },
];

// Qwen3-TTS テスト用スクリプトデータ
// 長めの掛け合いで音声品質をテスト
export const scriptData: ScriptLine[] = [
  {
    id: 1,
    character: "zundamon",
    text: "やっほー！ずんだもんなのだ！今日はすごいお知らせがあるのだ！",
    scene: 1,
    voiceFile: "01_zundamon.wav",
    durationInFrames: 154, // 6.16s
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "Qwen3-TTS\nローカル音声合成",
      fontSize: 80,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 2,
    character: "metan",
    text: "あら、ずんだもん。何かしら？そんなに興奮して。",
    scene: 1,
    voiceFile: "02_metan.wav",
    durationInFrames: 196, // 7.84s
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🎤 音声合成技術",
      fontSize: 60,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 3,
    character: "zundamon",
    text: "なんと！クウェンスリーティーティーエスという音声合成が、マックでローカル実行できるようになったのだ！",
    displayText: "なんと！Qwen3-TTSという音声合成が、Macでローカル実行できるようになったのだ！",
    scene: 1,
    voiceFile: "03_zundamon.wav",
    durationInFrames: 238, // 9.52s
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "💻 ローカル実行\n☁️ クラウド不要",
      fontSize: 60,
      color: "#ffffff",
      animation: "slideUp",
    },
  },
  {
    id: 4,
    character: "metan",
    text: "それは興味深いわね。クラウドに送らなくても音声が作れるということかしら？",
    scene: 1,
    voiceFile: "04_metan.wav",
    durationInFrames: 240, // 9.6s
    pauseAfter: 15,
  },
  {
    id: 5,
    character: "zundamon",
    text: "そうなのだ！エムエルエックスという技術でアップルシリコンのマックに最適化されてるのだ！",
    displayText: "そうなのだ！MLXという技術でApple SiliconのMacに最適化されてるのだ！",
    scene: 2,
    voiceFile: "05_zundamon.wav",
    durationInFrames: 256, // 10.24s
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🍎 Apple Silicon\n⚡ MLX最適化",
      fontSize: 60,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 6,
    character: "metan",
    text: "へぇ、それならインターネット環境がなくても使えるわね。プライバシーの面でも安心だわ。",
    scene: 2,
    voiceFile: "06_metan.wav",
    durationInFrames: 244, // 9.76s
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🔒 プライバシー安心\n📵 オフライン対応",
      fontSize: 60,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 7,
    character: "zundamon",
    text: "しかもボイスデザインモードっていう機能があって、声の特徴を文章で指定できるのだ！",
    scene: 2,
    voiceFile: "07_zundamon.wav",
    durationInFrames: 152, // 6.08s
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🎨 Voice Design Mode\n✍️ 文章で声を指定",
      fontSize: 55,
      color: "#ffffff",
      animation: "slideLeft",
    },
  },
  {
    id: 8,
    character: "metan",
    text: "つまり、元気な声とか、落ち着いた声とか、好みの声を作れるということね。それは便利だわ。",
    scene: 2,
    voiceFile: "08_metan.wav",
    durationInFrames: 280, // 11.2s
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "😊 元気な声\n😌 落ち着いた声\n🎭 好みの声を自在に",
      fontSize: 50,
      color: "#ffffff",
      animation: "bounce",
    },
  },
  {
    id: 9,
    character: "zundamon",
    text: "モデルサイズも選べて、軽いやつなら1.7ビリオンパラメータで動くのだ！",
    displayText: "モデルサイズも選べて、軽いやつなら1.7Bパラメータで動くのだ！",
    scene: 3,
    voiceFile: "09_zundamon.wav",
    durationInFrames: 224, // 8.96s
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "📦 1.7B パラメータ\n💨 軽量・高速",
      fontSize: 60,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 10,
    character: "metan",
    text: "4ビット量子化されているのかしら？それならメモリも少なくて済むわね。",
    displayText: "4bit量子化されているのかしら？それならメモリも少なくて済むわね。",
    scene: 3,
    voiceFile: "10_metan.wav",
    durationInFrames: 208, // 8.32s
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🔢 4bit 量子化\n💾 省メモリ",
      fontSize: 60,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 11,
    character: "zundamon",
    text: "さすがめたんは詳しいのだ！というわけで、みんなもローカル音声合成を試してみてほしいのだ！",
    scene: 3,
    voiceFile: "11_zundamon.wav",
    durationInFrames: 244, // 9.76s
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🚀 みんなも\n試してみてね！",
      fontSize: 70,
      color: "#ffffff",
      animation: "bounce",
    },
  },
  {
    id: 12,
    character: "metan",
    text: "それでは、良い音声合成ライフをお過ごしくださいね。バイバイ。",
    scene: 3,
    voiceFile: "12_metan.wav",
    durationInFrames: 210, // 8.4s
    pauseAfter: 5, // エンディングは短めに
    visual: {
      type: "text",
      text: "👋 バイバイ！",
      fontSize: 80,
      color: "#ffffff",
      animation: "slideUp",
    },
  },
];

// VOICEVOXスクリプト生成用
export const generateVoicevoxScript = (
  data: ScriptLine[],
  characterSpeakerMap: Record<CharacterId, number>
) => {
  return data.map((line) => ({
    id: line.id,
    character: line.character,
    speakerId: characterSpeakerMap[line.character],
    text: line.text, // 音声生成はtextを使用
    outputFile: line.voiceFile,
  }));
};

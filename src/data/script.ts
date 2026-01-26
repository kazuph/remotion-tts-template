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
  { id: 2, title: "特徴紹介", background: "solid" },
  { id: 3, title: "使い方", background: "solid" },
  { id: 4, title: "エンディング", background: "gradient" },
];

// リポジトリ紹介動画スクリプト
export const scriptData: ScriptLine[] = [
  // オープニング
  {
    id: 1,
    character: "aoi",
    text: "やっほー！あおいだよ！今日は最高のテンプレートを紹介するね！",
    scene: 1,
    voiceFile: "01_aoi.wav",
    durationInFrames: 160,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "Remotion\n+\nQwen3-TTS\nテンプレート",
      fontSize: 70,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 2,
    character: "murasaki",
    text: "むらさきよ。どんなテンプレートなの？",
    scene: 1,
    voiceFile: "02_murasaki.wav",
    durationInFrames: 90,
    pauseAfter: 15,
  },
  {
    id: 3,
    character: "aoi",
    text: "二人で掛け合いする紹介動画を、簡単に作れるテンプレートだよ！",
    scene: 1,
    voiceFile: "03_aoi.wav",
    durationInFrames: 138,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🎬 掛け合い動画を\n簡単に作成！",
      fontSize: 60,
      color: "#ffffff",
      animation: "bounce",
    },
  },
  {
    id: 4,
    character: "murasaki",
    text: "へぇ、この動画自体もこのテンプレートで作られてるのね。",
    scene: 1,
    voiceFile: "04_murasaki.wav",
    durationInFrames: 140,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "✨ この動画も\nテンプレートで作成！",
      fontSize: 55,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },

  // 特徴紹介
  {
    id: 5,
    character: "aoi",
    text: "最大のポイントは、クラウドを使わずにローカルで音声を生成できることだよ！",
    scene: 2,
    voiceFile: "05_aoi.wav",
    durationInFrames: 190,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "💻 ローカル音声生成\n☁️ クラウド不要！",
      fontSize: 60,
      color: "#ffffff",
      animation: "slideUp",
    },
  },
  {
    id: 6,
    character: "murasaki",
    text: "アップルシリコンのマックがあれば、インターネットなしでも使えるのね。",
    displayText: "Apple SiliconのMacがあれば、インターネットなしでも使えるのね。",
    scene: 2,
    voiceFile: "06_murasaki.wav",
    durationInFrames: 134,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🍎 Apple Silicon\n📵 オフライン対応",
      fontSize: 60,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 7,
    character: "aoi",
    text: "しかも口パクが自動で同期するんだよ！音声の波形を解析してるの！",
    scene: 2,
    voiceFile: "07_aoi.wav",
    durationInFrames: 132,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "👄 口パク自動同期\n🎵 音声波形解析",
      fontSize: 60,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 8,
    character: "murasaki",
    text: "キャラクターの表情も変えられるの？",
    scene: 2,
    voiceFile: "08_murasaki.wav",
    durationInFrames: 56,
    pauseAfter: 15,
    emotion: "thinking",
  },
  {
    id: 9,
    character: "aoi",
    text: "もちろん！ハッピー、サプライズ、シンキング、いろいろ使えるよ！",
    displayText: "もちろん！happy、surprised、thinking、いろいろ使えるよ！",
    scene: 2,
    voiceFile: "09_aoi.wav",
    durationInFrames: 156,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "😊 happy\n😲 surprised\n🤔 thinking",
      fontSize: 55,
      color: "#ffffff",
      animation: "bounce",
    },
  },

  // 使い方
  {
    id: 10,
    character: "murasaki",
    text: "使い方は難しいの？",
    scene: 3,
    voiceFile: "10_murasaki.wav",
    durationInFrames: 74,
    pauseAfter: 15,
    emotion: "thinking",
  },
  {
    id: 11,
    character: "aoi",
    text: "クロードコードと組み合わせると超簡単だよ！セリフを言うだけで動画が作れるの！",
    displayText: "Claude Codeと組み合わせると超簡単だよ！セリフを言うだけで動画が作れるの！",
    scene: 3,
    voiceFile: "11_aoi.wav",
    durationInFrames: 174,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🤖 Claude Code連携\n💬 対話で動画作成",
      fontSize: 60,
      color: "#ffffff",
      animation: "slideLeft",
    },
  },
  {
    id: 12,
    character: "murasaki",
    text: "なるほど。紹介動画を作りたいって言えば、セリフから全部作ってくれるのね。",
    scene: 3,
    voiceFile: "12_murasaki.wav",
    durationInFrames: 254,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "「○○の紹介動画を\n作りたい」\n↓\n自動でセリフ生成！",
      fontSize: 45,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 13,
    character: "aoi",
    text: "ヤムルファイルでデザインも簡単にカスタマイズできるよ！",
    displayText: "YAMLファイルでデザインも簡単にカスタマイズできるよ！",
    scene: 3,
    voiceFile: "13_aoi.wav",
    durationInFrames: 84,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🎨 YAML設定\n✏️ 簡単カスタマイズ",
      fontSize: 60,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },

  // エンディング
  {
    id: 14,
    character: "murasaki",
    text: "これは便利ね。ギットハブからすぐに使えるの？",
    displayText: "これは便利ね。GitHubからすぐに使えるの？",
    scene: 4,
    voiceFile: "14_murasaki.wav",
    durationInFrames: 96,
    pauseAfter: 15,
  },
  {
    id: 15,
    character: "aoi",
    text: "そうだよ！ギットクローンして、エヌピーエムインストールするだけで始められるよ！",
    displayText: "そうだよ！git cloneして、npm installするだけで始められるよ！",
    scene: 4,
    voiceFile: "15_aoi.wav",
    durationInFrames: 180,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "git clone ...\nnpm install\n🚀 すぐスタート！",
      fontSize: 50,
      color: "#ffffff",
      animation: "slideUp",
    },
  },
  {
    id: 16,
    character: "aoi",
    text: "みんなもこのテンプレートで紹介動画を作ってみてね！",
    scene: 4,
    voiceFile: "16_aoi.wav",
    durationInFrames: 112,
    pauseAfter: 5,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🎉 みんなも\n使ってみてね！",
      fontSize: 70,
      color: "#ffffff",
      animation: "bounce",
    },
  },
  {
    id: 17,
    character: "murasaki",
    text: "またね！",
    scene: 4,
    voiceFile: "17_murasaki.wav",
    durationInFrames: 32,
    pauseAfter: 0,
  },
  {
    id: 18,
    character: "aoi",
    text: "バイバーイ！",
    scene: 4,
    voiceFile: "18_aoi.wav",
    durationInFrames: 18,
    pauseAfter: 30,
    visual: {
      type: "text",
      text: "👋 バイバイ！",
      fontSize: 80,
      color: "#ffffff",
      animation: "fadeIn",
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

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

// シーン定義（5キャラバージョン）
export const scenes: SceneInfo[] = [
  { id: 1, title: "オープニング", background: "gradient" },
  { id: 2, title: "自己紹介・あおい", background: "solid" },
  { id: 3, title: "自己紹介・むらさき", background: "solid" },
  { id: 4, title: "自己紹介・もふも", background: "solid" },
  { id: 5, title: "自己紹介・よる", background: "solid" },
  { id: 6, title: "自己紹介・どこ", background: "solid" },
  { id: 7, title: "ペア対話1", background: "solid" },
  { id: 8, title: "ペア対話2", background: "solid" },
  { id: 9, title: "エンディング", background: "gradient" },
];

// 5キャラクター紹介動画スクリプト（オリジナルキャラのみ）
export const scriptData: ScriptLine[] = [
  // ===== シーン1: オープニング =====
  {
    id: 1,
    character: "aoi",
    text: "やっほー！今日は特別な動画だよ！",
    scene: 1,
    voiceFile: "01_aoi.wav",
    durationInFrames: 116,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🎉 キャラクター\n大集合！",
      fontSize: 80,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 2,
    character: "murasaki",
    text: "このテンプレートで使えるキャラクターを紹介するわ。",
    scene: 1,
    voiceFile: "02_murasaki.wav",
    durationInFrames: 88,
    pauseAfter: 10,
  },
  {
    id: 3,
    character: "aoi",
    text: "全部で5人いるんだよ！順番に自己紹介していくね！",
    scene: 1,
    voiceFile: "03_aoi.wav",
    durationInFrames: 112,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "5 Characters",
      fontSize: 90,
      color: "#ffffff",
      animation: "bounce",
    },
  },

  // ===== シーン2: 自己紹介・あおい =====
  {
    id: 4,
    character: "aoi",
    text: "私はあおい！ロボット女子だよ！元気いっぱいがモットー！",
    scene: 2,
    voiceFile: "04_aoi.wav",
    durationInFrames: 142,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🤖 あおい\nロボット女子",
      fontSize: 60,
      color: "#00BFFF",
      animation: "slideUp",
    },
  },

  // ===== シーン3: 自己紹介・むらさき =====
  {
    id: 5,
    character: "murasaki",
    text: "私はむらさき。知的でクールな着物美人よ。よろしくね。",
    scene: 3,
    voiceFile: "05_murasaki.wav",
    durationInFrames: 158,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "👘 むらさき\n知的な着物美人",
      fontSize: 60,
      color: "#9932CC",
      animation: "fadeIn",
    },
  },

  // ===== シーン4: 自己紹介・もふも =====
  {
    id: 6,
    character: "mofumo",
    text: "もふもだよー。もふもふしてるのー。",
    scene: 4,
    voiceFile: "06_mofumo.wav",
    durationInFrames: 116,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🐰 もふも\nもふもふ小動物",
      fontSize: 60,
      color: "#FFB6C1",
      animation: "bounce",
    },
  },

  // ===== シーン5: 自己紹介・よる =====
  {
    id: 7,
    character: "yoru",
    text: "よるだよー。眠いー。深夜テンションー。",
    scene: 5,
    voiceFile: "07_yoru.wav",
    durationInFrames: 638,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🌙 よる\nパーカー女子",
      fontSize: 60,
      color: "#4169E1",
      animation: "fadeIn",
    },
  },

  // ===== シーン6: 自己紹介・どこ =====
  {
    id: 8,
    character: "doko",
    text: "どこちゃんだよ！人を探してるの！誰かいませんかー！",
    scene: 6,
    voiceFile: "08_doko.wav",
    durationInFrames: 162,
    pauseAfter: 15,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🔍 どこ\n人探し中！",
      fontSize: 60,
      color: "#7B9E89",
      animation: "bounce",
    },
  },

  // ===== シーン7: ペア対話1（もふも＆よる） =====
  {
    id: 9,
    character: "mofumo",
    text: "よるちゃん！一緒に遊ぼうよー！",
    scene: 7,
    voiceFile: "09_mofumo.wav",
    durationInFrames: 70,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🐰 × 🌙\nもふも & よる",
      fontSize: 50,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 10,
    character: "yoru",
    text: "んー…眠いー…でも遊ぶー…",
    scene: 7,
    voiceFile: "10_yoru.wav",
    durationInFrames: 264,
    pauseAfter: 10,
  },
  {
    id: 11,
    character: "mofumo",
    text: "じゃあお昼寝しながら遊ぼー！",
    scene: 7,
    voiceFile: "11_mofumo.wav",
    durationInFrames: 78,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 12,
    character: "yoru",
    text: "それいいねー…zzz…",
    scene: 7,
    voiceFile: "12_yoru.wav",
    durationInFrames: 444,
    pauseAfter: 15,
    emotion: "thinking",
  },

  // ===== シーン8: ペア対話2（あおい＆どこ） =====
  {
    id: 13,
    character: "aoi",
    text: "どこちゃん！誰を探してるの？",
    scene: 8,
    voiceFile: "13_aoi.wav",
    durationInFrames: 78,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🤖 × 🔍\nあおい & どこ",
      fontSize: 50,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 14,
    character: "doko",
    text: "えっとねー、友達を探してるの！",
    scene: 8,
    voiceFile: "14_doko.wav",
    durationInFrames: 144,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 15,
    character: "aoi",
    text: "私たちみんな友達だよ！",
    scene: 8,
    voiceFile: "15_aoi.wav",
    durationInFrames: 50,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 16,
    character: "doko",
    text: "わーい！見つかったー！",
    scene: 8,
    voiceFile: "16_doko.wav",
    durationInFrames: 132,
    pauseAfter: 15,
    emotion: "happy",
  },

  // ===== シーン9: エンディング（全員集合） =====
  {
    id: 17,
    character: "aoi",
    text: "というわけで、5人のキャラクターを紹介したよ！",
    scene: 9,
    voiceFile: "17_aoi.wav",
    durationInFrames: 112,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "🎬 まとめ",
      fontSize: 80,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 18,
    character: "murasaki",
    text: "好きな組み合わせで動画を作ってみてね。",
    scene: 9,
    voiceFile: "18_murasaki.wav",
    durationInFrames: 60,
    pauseAfter: 10,
  },
  {
    id: 19,
    character: "mofumo",
    text: "キャラクターは簡単に追加できるよー！",
    scene: 9,
    voiceFile: "19_mofumo.wav",
    durationInFrames: 96,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 20,
    character: "murasaki",
    text: "ヤムルファイルで設定するだけよ。",
    displayText: "YAMLファイルで設定するだけよ。",
    scene: 9,
    voiceFile: "20_murasaki.wav",
    durationInFrames: 60,
    pauseAfter: 10,
  },
  {
    id: 21,
    character: "yoru",
    text: "じゃあねー。おやすみー。",
    scene: 9,
    voiceFile: "21_yoru.wav",
    durationInFrames: 108,
    pauseAfter: 5,
  },
  {
    id: 22,
    character: "doko",
    text: "またねー！探しに来てねー！",
    scene: 9,
    voiceFile: "22_doko.wav",
    durationInFrames: 94,
    pauseAfter: 5,
    emotion: "happy",
  },
  {
    id: 23,
    character: "aoi",
    text: "バイバーイ！",
    scene: 9,
    voiceFile: "23_aoi.wav",
    durationInFrames: 24,
    pauseAfter: 30,
    emotion: "happy",
    visual: {
      type: "text",
      text: "👋 See you!",
      fontSize: 80,
      color: "#ffffff",
      animation: "bounce",
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

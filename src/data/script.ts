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

// シーン定義
export const scenes: SceneInfo[] = [
  { id: 1, title: "オープニング", background: "gradient" },
  { id: 2, title: "自己紹介・あおい", background: "solid" },
  { id: 3, title: "自己紹介・むらさき", background: "solid" },
  { id: 4, title: "自己紹介・ずんだもん", background: "solid" },
  { id: 5, title: "自己紹介・めたん", background: "solid" },
  { id: 6, title: "自己紹介・もふも", background: "solid" },
  { id: 7, title: "自己紹介・よる", background: "solid" },
  { id: 8, title: "自己紹介・どこ", background: "solid" },
  { id: 9, title: "ペア対話1", background: "solid" },
  { id: 10, title: "ペア対話2", background: "solid" },
  { id: 11, title: "エンディング", background: "gradient" },
];

// 6キャラクター紹介動画スクリプト
export const scriptData: ScriptLine[] = [
  // ===== シーン1: オープニング =====
  {
    id: 1,
    character: "aoi",
    text: "やっほー！今日は特別な動画だよ！",
    scene: 1,
    voiceFile: "01_aoi.wav",
    durationInFrames: 86,
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
    durationInFrames: 108,
    pauseAfter: 10,
  },
  {
    id: 3,
    character: "aoi",
    text: "全部で7人いるんだよ！順番に自己紹介していくね！",
    scene: 1,
    voiceFile: "03_aoi.wav",
    durationInFrames: 108,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "7 Characters",
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
    durationInFrames: 136,
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
    durationInFrames: 162,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "👘 むらさき\n知的な着物美人",
      fontSize: 60,
      color: "#9932CC",
      animation: "fadeIn",
    },
  },
  // ===== シーン4: 自己紹介・ずんだもん =====
  {
    id: 6,
    character: "zundamon",
    text: "ずんだもんなのだ！枝豆パワーで頑張るのだ！",
    scene: 4,
    voiceFile: "06_zundamon.wav",
    durationInFrames: 140,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🫛 ずんだもん\n枝豆パワー",
      fontSize: 60,
      color: "#228B22",
      animation: "bounce",
    },
  },
  // ===== シーン5: 自己紹介・めたん =====
  {
    id: 7,
    character: "metan",
    text: "四国めたんよ。ずんだもんと一緒によく登場するわ。",
    scene: 5,
    voiceFile: "07_metan.wav",
    durationInFrames: 150,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "💗 めたん\nピンク髪メイド",
      fontSize: 60,
      color: "#FF1493",
      animation: "slideLeft",
    },
  },
  // ===== シーン6: 自己紹介・もふも =====
  {
    id: 8,
    character: "mofumo",
    text: "もふもだよー。もふもふしてるのー。",
    scene: 6,
    voiceFile: "08_mofumo.wav",
    durationInFrames: 164,
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
  // ===== シーン7: 自己紹介・よる =====
  {
    id: 9,
    character: "yoru",
    text: "よるだよー。眠いー。深夜テンションー。",
    scene: 7,
    voiceFile: "09_yoru.wav",
    durationInFrames: 208,
    pauseAfter: 15,
    visual: {
      type: "text",
      text: "🌙 よる\nパーカー女子",
      fontSize: 60,
      color: "#4169E1",
      animation: "fadeIn",
    },
  },
  // ===== シーン8: 自己紹介・どこ =====
  {
    id: 28,
    character: "doko",
    text: "どこちゃんだよ！人を探してるの！誰かいませんかー！",
    scene: 8,
    voiceFile: "28_doko.wav",
    durationInFrames: 150,
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

  // ===== シーン9: ペア対話1（ずんだもん＆もふも） =====
  {
    id: 10,
    character: "zundamon",
    text: "もふも！一緒に遊ぶのだ！",
    scene: 9,
    voiceFile: "10_zundamon.wav",
    durationInFrames: 86,
    pauseAfter: 10,
    emotion: "happy",
    visual: {
      type: "text",
      text: "🫛 × 🐰\nずんだもん & もふも",
      fontSize: 50,
      color: "#ffffff",
      animation: "zoomIn",
    },
  },
  {
    id: 11,
    character: "mofumo",
    text: "わーい！何して遊ぶのー？",
    scene: 9,
    voiceFile: "11_mofumo.wav",
    durationInFrames: 150,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 12,
    character: "zundamon",
    text: "枝豆を数えるのだ！1、2、3…",
    scene: 9,
    voiceFile: "12_zundamon.wav",
    durationInFrames: 92,
    pauseAfter: 10,
  },
  {
    id: 13,
    character: "mofumo",
    text: "すごーい…でも眠くなってきたー…",
    scene: 9,
    voiceFile: "13_mofumo.wav",
    durationInFrames: 136,
    pauseAfter: 10,
    emotion: "thinking",
  },
  {
    id: 14,
    character: "zundamon",
    text: "起きるのだ！まだ3つしか数えてないのだ！",
    scene: 9,
    voiceFile: "14_zundamon.wav",
    durationInFrames: 146,
    pauseAfter: 15,
    emotion: "surprised",
  },

  // ===== シーン10: ペア対話2（むらさき＆よる） =====
  {
    id: 15,
    character: "murasaki",
    text: "よる、最近何してるの？",
    scene: 10,
    voiceFile: "15_murasaki.wav",
    durationInFrames: 96,
    pauseAfter: 10,
    visual: {
      type: "text",
      text: "👘 × 🌙\nむらさき & よる",
      fontSize: 50,
      color: "#ffffff",
      animation: "fadeIn",
    },
  },
  {
    id: 16,
    character: "yoru",
    text: "んー…深夜アニメ見てるー…",
    scene: 10,
    voiceFile: "16_yoru.wav",
    durationInFrames: 124,
    pauseAfter: 10,
  },
  {
    id: 17,
    character: "murasaki",
    text: "それで眠そうなのね。体に悪いわよ。",
    scene: 10,
    voiceFile: "17_murasaki.wav",
    durationInFrames: 120,
    pauseAfter: 10,
    emotion: "thinking",
  },
  {
    id: 18,
    character: "yoru",
    text: "でも面白いんだもんー…むらさきさんも見るー？",
    scene: 10,
    voiceFile: "18_yoru.wav",
    durationInFrames: 150,
    pauseAfter: 10,
  },
  {
    id: 19,
    character: "murasaki",
    text: "…少しだけなら付き合うわ。",
    scene: 10,
    voiceFile: "19_murasaki.wav",
    durationInFrames: 106,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 20,
    character: "yoru",
    text: "やったー。ポテチ持ってくるー。",
    scene: 10,
    voiceFile: "20_yoru.wav",
    durationInFrames: 134,
    pauseAfter: 15,
    emotion: "happy",
  },

  // ===== シーン11: エンディング（全員集合） =====
  {
    id: 21,
    character: "aoi",
    text: "というわけで、7人のキャラクターを紹介したよ！",
    scene: 11,
    voiceFile: "21_aoi.wav",
    durationInFrames: 100,
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
    id: 22,
    character: "metan",
    text: "好きな組み合わせで動画を作ってみてね。",
    scene: 11,
    voiceFile: "22_metan.wav",
    durationInFrames: 176,
    pauseAfter: 10,
  },
  {
    id: 23,
    character: "zundamon",
    text: "キャラクターは簡単に追加できるのだ！",
    scene: 11,
    voiceFile: "23_zundamon.wav",
    durationInFrames: 84,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 24,
    character: "murasaki",
    text: "ヤムルファイルで設定するだけよ。",
    displayText: "YAMLファイルで設定するだけよ。",
    scene: 11,
    voiceFile: "24_murasaki.wav",
    durationInFrames: 62,
    pauseAfter: 10,
  },
  {
    id: 25,
    character: "mofumo",
    text: "みんなで動画作ろうねー！",
    scene: 11,
    voiceFile: "25_mofumo.wav",
    durationInFrames: 76,
    pauseAfter: 10,
    emotion: "happy",
  },
  {
    id: 26,
    character: "yoru",
    text: "じゃあねー。おやすみー。",
    scene: 11,
    voiceFile: "26_yoru.wav",
    durationInFrames: 106,
    pauseAfter: 5,
  },
  {
    id: 27,
    character: "aoi",
    text: "バイバーイ！",
    scene: 11,
    voiceFile: "27_aoi.wav",
    durationInFrames: 20,
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

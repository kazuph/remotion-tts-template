// このファイルは自動生成されます
// 編集する場合は video-settings.yaml と characters.yaml を編集してください
// npm run sync-settings で再生成されます

export const SETTINGS = {
  "font": {
    "family": "M PLUS Rounded 1c",
    "size": 70,
    "weight": "900",
    "color": "#ffffff",
    "outlineColor": "character",
    "innerOutlineColor": "none"
  },
  "subtitle": {
    "bottomOffset": 40,
    "maxWidthPercent": 55,
    "maxWidthPixels": 1000,
    "outlineWidth": 14,
    "innerOutlineWidth": 8
  },
  "character": {
    "height": 275,
    "useImages": true,
    "imagesBasePath": "images"
  },
  "content": {
    "topPadding": 0,
    "sidePadding": 0,
    "bottomPadding": 0
  },
  "video": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "playbackRate": 1.2
  },
  "colors": {
    "background": "#ffffff",
    "text": "#ffffff",
    "zundamon": "#228B22",
    "metan": "#FF1493"
  }
} as const;

// キャラクター定義（characters.yaml から生成）
export const CHARACTERS = {
  "aoi": {
    "name": "あおい",
    "description": "ロボット女子。耳からアンテナが生えている。元気で明るい。",
    "voice_instruct": "元気いっぱいで明るい少女の声。テンション高めでハキハキと話す。友達に話しかけるようなフレンドリーな口調",
    "color": "#00BFFF",
    "position": "right"
  },
  "murasaki": {
    "name": "むらさき",
    "description": "紫の着物を着た知的な女性。クールで落ち着いている。",
    "voice_instruct": "知的でクールな大人の女性の声。落ち着いていて淡々と話す。少しミステリアスな雰囲気",
    "color": "#9932CC",
    "position": "left"
  },
  "mofumo": {
    "name": "もふも",
    "description": "もふもふの毛がふさふさな謎の小動物。のんびりしている。",
    "voice_instruct": "高い女の子の声でのんびりとした謎の小動物。ふわふわした可愛い話し方。語尾が伸びる",
    "color": "#FFB6C1",
    "position": "right"
  },
  "yoru": {
    "name": "よる",
    "description": "深夜にコンビニに行く感じのパーカー女子。眠そうで気だるい。",
    "voice_instruct": "眠そうで気だるい女の子の声。ゆるくてマイペース。深夜テンション",
    "color": "#4169E1",
    "position": "left"
  },
  "zundamon": {
    "name": "ずんだもん",
    "description": "東北ずん子の関連キャラ。緑の枝豆をモチーフにしたちびキャラ。",
    "voice_instruct": "元気で明るい女の子の声。高めのトーンで可愛らしく話す。語尾に「〜のだ」「〜なのだ」をつける",
    "color": "#228B22",
    "position": "right"
  },
  "metan": {
    "name": "めたん",
    "description": "四国めたん。ピンク髪のメイド風キャラ。",
    "voice_instruct": "落ち着いた大人の女性の声。語尾に「〜わ」「〜ね」をつける",
    "color": "#FF1493",
    "position": "left"
  },
  "doko": {
    "name": "どこ",
    "description": "人を探している元気な女の子。グレーのパーカーを着て敬礼ポーズ。",
    "voice_instruct": "元気いっぱいで明るい女の子の声。ハキハキと話す。人懐っこくてフレンドリー",
    "color": "#7B9E89",
    "position": "right"
  }
} as const;

// 利用可能な感情
export const EMOTIONS = [
  "normal",
  "happy",
  "surprised",
  "thinking",
  "sad"
] as const;

// キャラクターごとの利用可能な画像ファイル
export const AVAILABLE_IMAGES: Record<string, string[]> = {
  "aoi": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "doko": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "metan": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "mofumo": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "murasaki": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "yoru": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ],
  "zundamon": [
    "happy_close.png",
    "happy_open.png",
    "mouth_close.png",
    "mouth_open.png",
    "sad_close.png",
    "sad_open.png",
    "surprised_close.png",
    "surprised_open.png",
    "thinking_close.png",
    "thinking_open.png"
  ]
};

// 型定義
export type VideoSettings = typeof SETTINGS;
export type CharacterId = "aoi" | "murasaki" | "mofumo" | "yoru" | "zundamon" | "metan" | "doko";
export type Emotion = typeof EMOTIONS[number];

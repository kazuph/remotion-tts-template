# Remotion + Qwen3-TTS 動画テンプレート 詳細ガイド

ずんだもん＆めたんの掛け合い紹介動画を作成するための完全ガイドです。
Apple Silicon Mac上でQwen3-TTS（MLX）を使用して音声を生成します。

---

## 目次

1. [クイックスタート](#クイックスタート)
2. [Claude Codeでの使い方](#claude-codeでの使い方)
3. [セリフの書き方](#セリフの書き方)
4. [英語の発音問題](#英語の発音問題)
5. [キャラクター画像](#キャラクター画像)
6. [スタイル設定（video-settings.yaml）](#スタイル設定video-settingsyaml)
7. [手動での使い方](#手動での使い方)
8. [ファイル構成](#ファイル構成)
9. [トラブルシューティング](#トラブルシューティング)
10. [Tips](#tips)

---

## クイックスタート

```bash
# 1. テンプレートをコピー
git clone https://github.com/kazuph/remotion-tts-template.git my-video
cd my-video
npm install

# 2. Python仮想環境をセットアップ
python3 -m venv .venv
source .venv/bin/activate
pip install git+https://github.com/Blaizzy/mlx-audio.git soundfile numpy
pip install mlx-whisper  # 検証用

# 3. プレビューサーバーを起動
npm start
# → http://localhost:3000 でプレビュー確認

# 4. Claude Codeで開く（別ターミナル）
claude
```

---

## Claude Codeでの使い方

### 基本の流れ

```
┌──────────────────────────────────────┐
│ 1. 「〇〇の紹介動画を作りたい」        │
│         ↓                           │
│ 2. Claudeがセリフを作成               │
│         ↓                           │
│ 3. 「音声生成して」                   │
│         ↓                           │
│ 4. 「プレビュー見せて」で確認          │
│         ↓                           │
│ 5. 修正があれば指示                   │
│         ↓                           │
│ 6. 「動画出力して」で完成！            │
└──────────────────────────────────────┘
```

### よく使う指示

#### 動画を作る
```
「Homebrewの紹介動画を作りたい」
「Pythonの基礎を説明する動画を作って。初心者向けに」
「このアプリの使い方動画を作りたい」
```

#### セリフを修正する
```
「ID 5のセリフを『〇〇〇』に変更して」
「シーン2のセリフをもっと短くして」
「めたんのセリフをもっと増やして」
「専門用語を減らして」
```

#### 発音を修正する
```
「GitHubをギットハブって発音して」
「英語の発音がおかしいところを全部カタカナにして」
```

#### 生成・出力する
```
「音声を生成して」
「プレビュー見せて」
「動画を出力して」
```

---

## セリフの書き方

### ファイル: `src/data/script.ts`

```typescript
export const scriptData: ScriptLine[] = [
  {
    id: 1,                              // ユニークID（連番）
    character: "zundamon",              // "zundamon" または "metan"
    text: "こんにちは！",                // 音声生成用
    displayText: "Hello!",              // 字幕用（省略可）
    scene: 1,                           // シーン番号
    voiceFile: "01_zundamon.wav",       // 音声ファイル名
    durationInFrames: 100,              // 音声生成後に自動更新
    pauseAfter: 10,                     // セリフ後の間（フレーム数）
    emotion: "happy",                   // 表情（省略可）
  },
];
```

### キャラクターの口調

| キャラクター | 役割 | 語尾 | 性格 |
|-------------|------|------|------|
| ずんだもん | 説明役 | 「〜なのだ！」「〜のだ」 | 元気、明るい |
| めたん | 聞き役 | 「〜わ」「〜ね」「〜かしら？」 | 落ち着いた、質問上手 |

---

## 英語の発音問題

TTSモデルは英語を正しく発音できないことがあります。`text`にカタカナ、`displayText`に英語を設定します。

```typescript
{
  text: "ホームブルーでインストールするのだ！",      // 音声用
  displayText: "Homebrewでインストールするのだ！", // 字幕用
}
```

### よく使う変換表

| 英語 | カタカナ |
|------|---------|
| macOS | マックオーエス |
| iPhone | アイフォン |
| GitHub | ギットハブ |
| API | エーピーアイ |
| AI | エーアイ |
| Homebrew | ホームブルー |
| Ctrl+S | コントロールプラスエス |
| IME | アイエムイー |

---

## キャラクター画像

### フォルダ構造

```
public/images/
├── zundamon/
│   ├── mouth_open.png      # 通常・口開き（必須）
│   ├── mouth_close.png     # 通常・口閉じ（必須）
│   ├── happy_open.png      # happy表情（任意）
│   ├── happy_close.png     # （任意）
│   └── ...
└── metan/
    └── （同様）
```

**注意:** 表情差分は任意です。`npm run sync-settings`で画像フォルダをスキャンし、存在しない表情は自動的に`mouth_open/mouth_close`にフォールバックします。

### 表情の使い方

**基本ルール:**
- 基本は`normal`（口パク）で話す
- 表情差分は**多用しない**、ここぞというところで使用
- リアクションは最低0.5秒（15フレーム）継続させる

**使いどころ:**
| 表情 | 使うタイミング |
|------|----------------|
| `normal` | 通常の説明、会話（デフォルト） |
| `happy` | 嬉しいとき、褒めるとき、ポイント強調 |
| `surprised` | 驚いたとき、意外な事実 |
| `thinking` | 考え込むとき、説明を聞くとき |
| `sad` | 残念なとき、問題点を指摘 |

```typescript
// NG: 表情を多用しすぎ
{ text: "すごいのだ！", emotion: "happy" },
{ text: "便利なのだ！", emotion: "happy" },

// OK: ここぞというところで使う
{ text: "すごいのだ！" },  // normal（省略可）
{ text: "これが一番のポイントなのだ！", emotion: "happy" },  // ← ここぞ
```

### 画像パスの変更

`video-settings.yaml`で設定：

```yaml
character:
  useImages: true               # 画像を使用する
  imagesBasePath: "images"      # public/images/{characterId}/
  # または共有フォルダ
  # imagesBasePath: "/Users/shared/characters"
```

### 画像の入手先

| キャラクター | 入手先 |
|-------------|--------|
| ずんだもん | [公式](https://zunko.jp/con_illust.html)、ニコニ・コモンズ |
| 四国めたん | [公式](https://zunko.jp/con_illust.html)、ニコニ・コモンズ |

※ 各素材の利用規約を必ず確認してください

---

## スタイル設定（video-settings.yaml）

### デフォルト（黒板風デザイン）

```yaml
# フォント設定
font:
  family: "M PLUS Rounded 1c"   # ポップ体
  size: 70
  weight: "900"                 # エクストラボールド
  color: "#ffffff"              # 白文字
  outlineColor: "character"     # キャラクターごとの色

# キャラクター設定
character:
  height: 275
  useImages: true
  imagesBasePath: "images"

# カラー設定（黒板風）
colors:
  background: "#ffffff"
  zundamon: "#228B22"           # フォレストグリーン
  metan: "#FF1493"              # ディープピンク
```

### おすすめフォント

| フォント | 特徴 |
|----------|------|
| M PLUS Rounded 1c | 丸ゴシック、ポップ（デフォルト） |
| Noto Sans JP | 標準的、読みやすい |
| Kosugi Maru | 丸ゴシック、親しみやすい |

---

## 手動での使い方

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm start` | プレビュー（http://localhost:3000） |
| `.venv/bin/python scripts/generate-voices-qwen.py` | 音声生成（Qwen3-TTS） |
| `npm run build` | 動画出力（out/video.mp4） |
| `npm run init` | 新規プロジェクト初期化（スクリプトをリセット） |
| `npm run sync-settings` | YAML設定を反映＋画像スキャン |

### 手順

1. `src/data/script.ts` を編集
2. `.venv/bin/python scripts/generate-voices-qwen.py` で音声生成
3. `npm start` でプレビュー確認
4. `npm run build` で動画出力

---

## ファイル構成

```
├── video-settings.yaml      # ★ スタイル設定
├── src/
│   ├── data/
│   │   ├── script.ts        # ★ セリフデータ
│   │   └── mouth-data.generated.ts  # 口パクデータ（自動生成）
│   ├── components/
│   │   ├── Character.tsx    # キャラクター表示
│   │   ├── Subtitle.tsx     # 字幕
│   │   └── SceneVisuals.tsx # シーン別ビジュアル
│   ├── config.ts            # 基本設定（FPS、playbackRate）
│   └── Main.tsx             # メインコンポーネント
├── scripts/
│   └── generate-voices-qwen.py  # 音声生成スクリプト
├── public/
│   ├── images/              # キャラクター画像
│   └── voices/              # 音声ファイル（自動生成）
├── skills/
│   └── remotion-qwen-tts/   # 動画生成スキル（詳細ドキュメント）
└── out/
    └── video.mp4            # 出力動画
```

---

## トラブルシューティング

### 音声生成でエラーが出る
```
ModuleNotFoundError: No module named 'mlx_audio'
```
→ `.venv/bin/python`を使っているか確認。仮想環境をアクティベートして再実行。

### 音声と字幕がずれる
→ 音声を再生成してdurationInFramesを更新

### 英語の発音がおかしい
→ `text`をカタカナに、`displayText`に英語を設定

### キャラクター画像が表示されない
→ `video-settings.yaml`の`useImages: true`を確認
→ 画像パスを確認

### 音声ファイルが見つからない
```
Error: Could not find file: voices/XX_zundamon.wav
```
→ `scripts/generate-voices-qwen.py` で音声を生成

### 末尾に長い無音がある
→ `Root.tsx`でのフレーム計算を確認。`skills/remotion-qwen-tts/`のドキュメントを参照

### セリフが途中で切れる
→ 二重playbackRate調整の問題。`skills/remotion-qwen-tts/`のドキュメントを参照

---

## コンテンツ表示（画像・テキスト）

### 画像を表示

セリフごとに`visual`フィールドで画像を指定：

```typescript
{
  id: 3,
  character: "zundamon",
  text: "これがインストール画面なのだ！",
  visual: {
    type: "image",
    src: "install-screen.png",  // public/content/内の画像
    animation: "fadeIn",
  },
}
```

### テキストを表示

```typescript
{
  visual: {
    type: "text",
    text: "ポイント1",
    fontSize: 72,
    color: "#ffffff",
    animation: "bounce",
  },
}
```

### アニメーション

| animation | 効果 |
|-----------|------|
| `none` | アニメーションなし |
| `fadeIn` | フェードイン（デフォルト） |
| `slideUp` | 下から上へスライド |
| `slideLeft` | 右から左へスライド |
| `zoomIn` | 拡大しながら表示 |
| `bounce` | 弾むように表示 |

---

## BGM・効果音

### BGM設定

`src/data/script.ts`でBGMを設定：

```typescript
export const bgmConfig: BGMConfig = {
  src: "background.mp3",  // public/bgm/内のファイル
  volume: 0.3,
  loop: true,
};
```

### 効果音

セリフごとに`se`フィールドで効果音を指定：

```typescript
{
  id: 5,
  character: "zundamon",
  text: "ポイントはここなのだ！",
  se: {
    src: "chime.mp3",  // public/se/内のファイル
    volume: 0.8,
  },
}
```

### フォルダ構造

```
public/
├── bgm/           # 背景音楽
├── se/            # 効果音
├── content/       # コンテンツ画像
├── images/        # キャラクター画像
└── voices/        # 音声ファイル（自動生成）
```

---

## Tips

### 二人で「バイバイ」を合わせる

```typescript
{
  id: 44,
  character: "metan",
  text: "バイバイ〜！",
  pauseAfter: 0,  // ← 間を0に
},
{
  id: 45,
  character: "zundamon",
  text: "バイバイなのだ〜！",
  pauseAfter: 60,
},
```

### 解説に必要な素材を指示する

スクリプトにコメントで記載：

```typescript
{
  id: 5,
  text: "こんな感じでインストールするのだ！",
  // <<ターミナルでbrew installを実行しているスクリーンショット>>
},
```

### コンテンツ表示のルール

- コンテンツは**画面全体を使って最大限大きく**表示
- 無駄な余白は作らない
- 字幕とキャラクターはコンテンツの上に重ねて表示

---

## Qwen3-TTS詳細ドキュメント

動画生成の詳細な技術情報（フレーム計算、口パク同期、検証ワークフローなど）については、
**[skills/remotion-qwen-tts/](./skills/remotion-qwen-tts/)** を参照してください。

特に以下の内容が含まれています：
- フレーム計算の罠（二重調整問題）
- 口パク同期アルゴリズム
- 検証ワークフロー（Whisper検証、動画音声解析）
- トラブルシューティング詳細

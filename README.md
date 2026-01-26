# Remotion + Qwen3-TTS 動画テンプレート

ずんだもん＆めたんの掛け合い紹介動画を簡単に作成できるテンプレートです。
Apple Silicon Mac上でローカルTTS（Qwen3-TTS）を使用して音声生成します。

[![デモ動画](public/content/thumbnail.jpg)](https://github.com/kazuph/remotion-tts-template/releases/download/v1.0.0/demo.mp4)

> **↑ クリックでデモ動画を再生！この動画もこのテンプレートで作成されています！**

![デフォルトの黒板風デザイン](https://img.shields.io/badge/デザイン-黒板風-2d5a3d)
![解像度](https://img.shields.io/badge/解像度-1920x1080-blue)
![フレームレート](https://img.shields.io/badge/FPS-30-green)
![Apple Silicon](https://img.shields.io/badge/Apple_Silicon-M1%2FM2%2FM3%2FM4-black)

## 特徴

- **ローカルTTS** - Qwen3-TTS（MLX）でApple Silicon上で高速音声生成
- **口パクアニメーション** - 音声波形に同期した自然な口パク
- **対話的な動画作成** - Claude Codeと会話しながら動画を作成
- **表情差分対応** - happy, surprised, thinking, sad などの表情切り替え
- **BGM・効果音対応** - 場面に合わせた音声演出
- **カスタマイズ可能** - YAMLファイルでフォント、色、レイアウトを簡単変更

---

## クイックスタート

### 1. 必要なもの

| 必要環境 | 説明 |
|--------|------|
| Apple Silicon Mac | M1/M2/M3/M4チップ搭載のMac |
| [Node.js 18+](https://nodejs.org/) | JavaScript実行環境 |
| Python 3.10+ | 音声生成スクリプト用 |
| [Claude Code](https://claude.ai/code) | 対話的に動画を作成（推奨） |

### 2. セットアップ

```bash
git clone https://github.com/kazuph/remotion-tts-template.git my-video
cd my-video
npm install

# Python仮想環境のセットアップ
python3 -m venv .venv
source .venv/bin/activate

# MLX関連パッケージのインストール
pip install git+https://github.com/Blaizzy/mlx-audio.git soundfile numpy

# 検証用（Whisper）
pip install mlx-whisper
```

### 3. プレビューサーバーを起動

```bash
npm start
```

ブラウザで http://localhost:3000 を開くとプレビューが表示されます。
デモ用のセリフと音声が含まれているので、すぐに動作確認できます。

### 4. 動画を作成（Claude Code使用時）

```bash
claude  # 別ターミナルでClaude Codeを起動
```

Claude Codeに話しかけるだけ：

```
「〇〇の紹介動画を作りたい」
```

---

## 作業フロー

```
┌─────────────────────────────────────────────────────────────────┐
│                         準備                                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│  │ Node.js  │    │  Python  │    │  Claude  │                 │
│  │ インストール│    │   venv   │    │   起動   │                 │
│  └──────────┘    └──────────┘    └──────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. セリフ作成                                                   │
│     「〇〇の紹介動画を作りたい」                                  │
│                              │                                  │
│                              ▼                                  │
│     Claude がセリフを自動生成 → src/data/script.ts               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. 音声生成（Qwen3-TTS）                                        │
│     「音声を生成して」                                            │
│                              │                                  │
│                              ▼                                  │
│     MLXでローカル音声生成 → public/voices/*.wav                  │
│     口パクデータも同時生成 → src/data/mouth-data.generated.ts    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. プレビュー・修正                                              │
│     「プレビュー見せて」                                          │
│                              │                                  │
│              ┌───────────────┴───────────────┐                  │
│              ▼                               ▼                  │
│         問題なし                          修正あり               │
│              │                    「ID 3のセリフを変えて」        │
│              │                               │                  │
│              │                               ▼                  │
│              │                    セリフ修正 → 音声再生成         │
│              │                               │                  │
│              └───────────────┬───────────────┘                  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. 動画出力                                                     │
│     「動画を出力して」                                            │
│                              │                                  │
│                              ▼                                  │
│     Remotion でレンダリング → out/video.mp4  🎉                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## よく使う指示

| やりたいこと | 指示の例 |
|-------------|---------|
| 新規作成 | 「〇〇の紹介動画を作って」 |
| セリフ修正 | 「ID 3のセリフを変更して」 |
| 発音修正 | 「GitHubをギットハブって発音して」 |
| 音声生成 | 「音声を生成して」 |
| プレビュー | 「プレビュー見せて」 |
| 動画出力 | 「動画を出力して」 |

---

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm start` | プレビュー（http://localhost:3000） |
| `.venv/bin/python scripts/generate-voices-qwen.py` | 音声生成（Qwen3-TTS） |
| `npm run build` | 動画出力（out/video.mp4） |
| `npm run init` | 新規プロジェクト初期化 |

---

## 音声生成の設定

### キャラクター音声

`scripts/generate-voices-qwen.py`で音声のスタイルを設定：

```python
CHARACTER_INSTRUCTS = {
    "zundamon": "元気で明るく可愛らしい若い女の子の声。語尾に特徴があり、ハキハキとした話し方",
    "metan": "落ち着いた大人っぽい女性の声。上品で穏やかな話し方",
}
```

### 再生速度

`src/config.ts`で再生速度を調整：

```typescript
export const VIDEO_CONFIG = {
  fps: 30,
  playbackRate: 1.2,  // 音声を1.2倍速で再生
};
```

---

## キャラクター画像

`video-settings.yaml`で`useImages: true`に設定し、画像を配置：

```
public/images/
├── zundamon/
│   ├── mouth_open.png   # 口開き（必須）
│   ├── mouth_close.png  # 口閉じ（必須）
│   ├── happy_open.png   # 表情差分（任意）
│   └── ...
└── metan/
    └── ...
```

画像がない場合はプレースホルダーが表示されます。

---

## カスタマイズ

`video-settings.yaml`でスタイルを変更できます：

```yaml
font:
  family: "Noto Sans JP"
  size: 48
  color: "#ffffff"

character:
  height: 367
  useImages: true

colors:
  zundamon: "#228B22"
  metan: "#FF1493"
```

---

## BGM・効果音

効果音を追加して動画をより魅力的に：

```typescript
// セリフに効果音を追加
{
  text: "ここがポイントなのだ！",
  se: { src: "point.mp3", volume: 0.8 },
}
```

効果音の入手方法は **[効果音ガイド](./docs/sound-effects-guide.md)** を参照してください。

---

## 詳しい使い方

詳細は **[CLAUDE.md](./CLAUDE.md)** を参照してください。

Qwen3-TTSでの動画生成の詳細は **[skills/remotion-qwen-tts/](./skills/remotion-qwen-tts/)** を参照してください。

---

## ライセンス

MIT License

キャラクター（ずんだもん・四国めたん）の利用規約は各公式サイトをご確認ください。

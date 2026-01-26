# Gemini キャラクター画像生成スキル

Gemini APIを使ってRemotionテンプレート用のオリジナルキャラクター画像を生成するためのガイド。

## 前提条件

- `GEMINI_API_KEY` 環境変数が設定されていること
- `google-genai` パッケージがインストールされていること
- ImageMagick（`magick`コマンド）が利用可能であること

## 推奨モデル

**画像生成には最低でも Gemini 2.5 以上を使用すること！**

| モデル | 用途 | 備考 |
|--------|------|------|
| `gemini-2.5-flash-image` | 高速・高品質 | **推奨** |
| `gemini-3-pro-image-preview` | 最高品質 | より詳細な画像向け |

```
❌ NG: gemini-2.0-flash-exp
   → 画質が低い、古いモデル

✅ OK: gemini-2.5-flash-image 以上
   → 高品質な画像生成が可能
```

## 重要なルール

### 1. 口パク画像の一貫性（最重要）

**同じキャラクター・同じ表情の口開き/口閉じ画像は、必ず片方を参照して生成する。**

```
❌ NG: 口開きと口閉じを別々に生成
   → 髪型、服装、ポーズが微妙に違ってしまう
   → 口パクのたびにキャラが切り替わって見える

✅ OK: 口閉じを先に生成 → それを参照して口開きを生成
   → 同一キャラクターで口だけが変わる
```

### 2. 表情バリエーションの生成順序

```
1. まず基本の mouth_close.png を生成
2. mouth_close.png を参照して mouth_open.png を生成
3. mouth_close.png を参照して {emotion}_close.png を生成
4. {emotion}_close.png を参照して {emotion}_open.png を生成
```

**各ステップで必ず元画像を参照すること！**

### 3. 背景透過処理

**「transparent background」はプロンプトに使用禁止！**
- AIがチェッカーボード（市松模様）を描いてしまう

```
❌ NG: "transparent background"
✅ OK: "plain white background"
```

**透過処理はImageMagickのフラッドフィルで行う：**

```bash
# 外側の白背景だけを透過（キャラの肌は維持）
# 画像サイズを取得してから実行
dims=$(magick identify -format "%wx%h" input.png)
w=$(echo $dims | cut -dx -f1)
h=$(echo $dims | cut -dx -f2)

magick input.png -fuzz 5% -fill none \
  -draw "color 0,0 floodfill" \
  -draw "color 0,$((h-1)) floodfill" \
  -draw "color $((w-1)),0 floodfill" \
  -draw "color $((w-1)),$((h-1)) floodfill" \
  output.png
```

**fuzz値の選び方：**
- `5%`: 推奨値。眉毛や薄い色の部分を保護
- `10-15%`: 背景と境界がぼやけている場合のみ使用
- 高すぎると眉毛や薄い色の内部パーツが透過される

```
❌ NG: magick input.png -fuzz 10% -transparent white output.png
   → キャラの肌の白い部分も透過してしまう

❌ NG: fuzz 15% でフラッドフィル
   → 眉毛など薄い色の部分が透過される場合あり

✅ OK: fuzz 5% でフラッドフィル方式（四隅から塗りつぶし）
   → 外側の背景だけ透過、キャラ内部は維持
```

### 4. 生成後の検証（必須）

**生成した画像は必ずReadツールで確認する：**

```python
# 生成後
Read("/path/to/generated.png")  # 目視確認

# 緑背景で透過確認
magick -size 1024x1024 xc:green output.png -composite test.png
Read("/path/to/test.png")  # 透過部分が緑になっているか確認
```

**確認ポイント：**
- 同じ表情の口開き/口閉じが同一キャラに見えるか
- 背景が透過されているか
- キャラの肌や服が透けていないか
- ポーズや小物（手の位置など）が一致しているか

### 5. 音声の検証

**生成した音声は必ずWhisperで確認する：**

```python
import mlx_whisper
result = mlx_whisper.transcribe('path/to/audio.wav', language='ja')
print(result['text'])
```

## 実装例

### 基本画像の生成

```python
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# 1. 口閉じ版を生成
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=types.Content(
        role="user",
        parts=[types.Part.from_text(
            text="""Generate a cute anime-style chibi character face:
- [キャラクターの特徴を詳細に記述]
- Mouth closed with gentle smile
- Plain white background
- High quality anime illustration"""
        )]
    ),
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    ),
)
# 保存: mouth_close.png
```

### 参照画像を使った口開き版の生成

```python
# 2. 口閉じ版を参照して口開き版を生成
img_data = Path("mouth_close.png").read_bytes()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=types.Content(
        role="user",
        parts=[
            types.Part.from_bytes(data=img_data, mime_type="image/png"),
            types.Part.from_text(
                text="""Keep this EXACT same character with identical:
- Same hairstyle and hair color
- Same face shape and eye style
- Same clothing
- Same art style and colors
- Same pose and angle

ONLY change: Open the mouth as if speaking.
Keep everything else exactly the same. Plain white background."""
            )
        ]
    ),
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    ),
)
# 保存: mouth_open.png
```

### 表情バリエーションの生成

```python
# 3. 口閉じ版を参照してhappy表情（口閉じ）を生成
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=types.Content(
        role="user",
        parts=[
            types.Part.from_bytes(data=img_data, mime_type="image/png"),
            types.Part.from_text(
                text="""Keep this EXACT same character with identical:
- Same hairstyle and hair color
- Same face shape and eye style
- Same clothing
- Same art style and colors
- Same pose and angle

Change expression to HAPPY: [具体的な表情の説明]
Keep everything else exactly the same. Plain white background."""
            )
        ]
    ),
    ...
)
# 保存: happy_close.png

# 4. happy_close.png を参照してhappy_open.png を生成
# （上記と同様、happy_close.pngを読み込んで口を開けるよう指示）
```

## 動画キャッシュの注意点

ビルドした動画を確認する際、同じファイル名だとキャッシュが効いて古い動画が再生されることがある。

```bash
# バージョン付きファイル名でコピー
cp out/video.mp4 out/video_v2_fixed.mp4
open out/video_v2_fixed.mp4
```

## ファイル命名規則

```
public/images/{characterId}/
├── mouth_close.png      # 基本（口閉じ）
├── mouth_open.png       # 基本（口開き）
├── happy_close.png      # happy表情（口閉じ）
├── happy_open.png       # happy表情（口開き）
├── thinking_close.png   # thinking表情（口閉じ）
├── thinking_open.png    # thinking表情（口開き）
└── ...
```

## トラブルシューティング

### キャラが口パクのたびに別人に見える
→ 口開き/口閉じを別々に生成している。必ず片方を参照して生成する。

### キャラの肌が透けている
→ `-transparent white` ではなくフラッドフィル方式で透過処理する。

### 眉毛や薄い色の部分が透けている
→ fuzz値が高すぎる。15%から5%に下げて再処理する。

### 表情切り替えでポーズが変わる
→ 同じ表情の口開き/口閉じで、手の位置などが異なっている。
→ 口閉じを先に生成し、それを参照して口開きを生成する。

### 音声が途切れている/おかしい
→ Whisperで文字起こしして内容を確認する。
→ TTSパラメータ（temperature、max_tokens）を調整する。

## 環境変数

```bash
# 方法1: gemini-icon-creatorスキルの.envを使用（推奨）
export GEMINI_API_KEY=$(grep GEMINI_API_KEY ~/.claude/skills/gemini-icon-creator/.env | cut -d'=' -f2)

# 方法2: プロジェクトの.envファイルに設定（リポジトリにコミットしない）
GEMINI_API_KEY=your_api_key_here
```

## 依存関係

```bash
pip install google-genai
# または
uv pip install google-genai
```

## Claude への指示

このスキルを使用する際は：
1. 必ず生成した画像をReadツールで確認すること
2. 口開き/口閉じは必ず参照生成すること
3. 表情バリエーションも同様に参照生成すること
4. 背景透過はフラッドフィル方式を使うこと
5. 音声はWhisperで検証すること

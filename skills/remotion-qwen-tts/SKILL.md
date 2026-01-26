---
name: remotion-qwen-tts
description: Remotion + Qwen-TTS（MLX）で動画を生成する際の完全ガイド。音声生成、口パク同期、フレーム計算、そして必須の検証フェーズまでカバー。動画生成時に使用。
metadata:
  tags: remotion, qwen-tts, mlx, tts, video, apple-silicon, verification
---

# Remotion + Qwen-TTS 完全ガイド

Apple Silicon Mac上でQwen3-TTSを使用してRemotionで動画を生成するための完全ワークフロー。

**重要**: このスキルの核心は**検証フェーズ**。生成物を自分で確認せずに「完了」と報告してはならない。

## 目次

- [ワークフロー全体図](#ワークフロー全体図)
- [環境構築](#環境構築)
- [音声生成](#音声生成)
- [フレーム計算の罠](#フレーム計算の罠)
- [口パク同期](#口パク同期)
- [検証フェーズ（必須）](#検証フェーズ必須)
- [トラブルシューティング](#トラブルシューティング)

## 詳細ルール

より詳細な情報は以下のルールファイルを参照:

- [rules/frame-calculation.md](rules/frame-calculation.md) - フレーム計算の完全ガイド
- [rules/lip-sync.md](rules/lip-sync.md) - 口パク（リップシンク）完全ガイド
- [rules/verification-workflow.md](rules/verification-workflow.md) - 検証ワークフロー完全ガイド

---

## ワークフロー全体図

```
┌─────────────────────────────────────────────────────────────────┐
│                    動画生成ワークフロー                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. スクリプト作成                                                │
│     └─ src/data/script.ts にセリフを記述                         │
│                                                                  │
│  2. 音声生成 ───────────────────────────────────────────────────│
│     └─ scripts/generate-voices-qwen.py                          │
│        ├─ Qwen3-TTSで音声生成                                   │
│        ├─ 音声波形から口パクデータ抽出                           │
│        └─ durations.json, mouth-data.generated.ts 出力           │
│                                                                  │
│  3. 【検証1】個別音声検証 ─────────────────────────────────────│
│     └─ scripts/verify-voices.py (Whisper)                       │
│        ├─ 各音声を文字起こし                                     │
│        ├─ 元テキストと類似度比較                                 │
│        └─ 70%未満は警告 → 再生成検討                            │
│                                                                  │
│  4. 動画ビルド                                                   │
│     └─ npm run build                                            │
│                                                                  │
│  5. 【検証2】動画音声検証 ─────────────────────────────────────│
│     └─ scripts/analyze-video-audio.py                           │
│        ├─ 動画から音声抽出                                       │
│        ├─ 無音区間検出                                          │
│        ├─ 末尾無音チェック（3秒以上は問題）                      │
│        └─ セリフ途切れ検出                                       │
│                                                                  │
│  6. 目視確認                                                     │
│     └─ open out/video.mp4 で実際に視聴                          │
│                                                                  │
│  7. 完了報告（検証パスした場合のみ）                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 環境構築

### 必要なもの

- Apple Silicon Mac (M1/M2/M3/M4)
- Python 3.10+
- Node.js 18+

### セットアップ

```bash
# Python仮想環境
python3 -m venv .venv
source .venv/bin/activate

# MLX関連
pip install git+https://github.com/Blaizzy/mlx-audio.git soundfile numpy

# 検証用（Whisper）
pip install mlx-whisper

# Node依存
npm install
```

---

## 音声生成

### 基本コマンド

```bash
.venv/bin/python scripts/generate-voices-qwen.py
```

### 重要な設定

```python
# config.ts
export const VIDEO_CONFIG = {
  fps: 30,
  playbackRate: 1.2,  # 音声を1.2倍速で再生
};
```

### キャラクター音声設定

```python
CHARACTER_INSTRUCTS = {
    "zundamon": "元気で明るく可愛らしい若い女の子の声。語尾に特徴があり、ハキハキとした話し方",
    "metan": "落ち着いた大人っぽい女性の声。上品で穏やかな話し方",
}
```

---

## フレーム計算の罠

### 最重要ポイント: 二重調整問題

**絶対に避けるべき罠**: `durationInFrames`を複数箇所でplaybackRateで調整してしまう

#### 正しい設計

```
┌─────────────────────────────────────────────────────────────────┐
│ generate-voices-qwen.py                                          │
│   frames = int(duration / PLAYBACK_RATE * FPS)                  │
│   → durationInFramesは「playbackRate考慮済み」の値              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ script.ts                                                        │
│   durationInFrames: 180  // すでに1.2倍速考慮済み               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Main.tsx / Root.tsx                                              │
│   そのまま使用！ 二度割りしない！                                │
│   const getAdjustedFrames = (frames) => frames;  // OK           │
│   const getAdjustedFrames = (frames) => frames / playbackRate; // NG!
└─────────────────────────────────────────────────────────────────┘
```

#### 症状と原因

| 症状 | 原因 |
|------|------|
| 末尾に長い無音（10秒以上） | Root.tsxでplaybackRate調整してない |
| セリフが途中で切れる | Main.tsx/Root.tsxで二重にplaybackRate調整してる |
| 音声と映像がずれる | durationInFramesの計算式が間違ってる |

#### 計算例

```
音声長: 7.2秒
playbackRate: 1.2
FPS: 30

正しい計算:
  動画上の再生時間 = 7.2 / 1.2 = 6秒
  フレーム数 = 6 * 30 = 180フレーム
  durationInFrames = 180

間違い1（調整忘れ）:
  frames = 7.2 * 30 = 216フレーム → 末尾に無音

間違い2（二重調整）:
  durationInFrames = 180（正しい）
  Main.tsx: 180 / 1.2 = 150フレーム → セリフ切れ
```

---

## 口パク同期

### 音声波形からの口パクデータ抽出

```python
def extract_mouth_data(audio: np.ndarray, sample_rate: int, target_fps: int = 30) -> list[bool]:
    samples_per_frame = sample_rate // target_fps
    abs_audio = np.abs(audio)
    mouth_data = []
    threshold = 0.02  # 調整可能

    for i in range(0, len(audio), samples_per_frame):
        chunk = abs_audio[i:i + samples_per_frame]
        if len(chunk) > 0:
            rms = np.sqrt(np.mean(chunk ** 2))
            mouth_data.append(bool(rms > threshold))  # Python boolに変換！
        else:
            mouth_data.append(False)
    return mouth_data
```

### 注意点

1. **numpy.bool_ → Python bool変換**: JSONシリアライズ時にエラーになる
2. **playbackRate考慮**: 口パクデータのFPSは動画FPS × playbackRateで生成

---

## 検証フェーズ（必須）

### 検証1: 個別音声検証（Whisper）

```bash
.venv/bin/python ~/.claude/skills/remotion-qwen-tts/scripts/verify-voices.py
```

#### 検証内容

- 各音声ファイルをWhisperで文字起こし
- 元テキストとの類似度計算
- 70%未満は警告

#### 判断基準

| 類似度 | 判定 | アクション |
|--------|------|-----------|
| 90%+ | 優秀 | そのまま使用 |
| 70-90% | 許容 | 確認推奨 |
| 50-70% | 警告 | 再生成検討 |
| 50%未満 | 失敗 | 再生成必須 |

### 検証2: 動画音声検証

```bash
.venv/bin/python ~/.claude/skills/remotion-qwen-tts/scripts/analyze-video-audio.py out/video.mp4
```

#### 検証内容

- 動画から音声抽出（モノラル）
- 無音区間検出（RMSベース）
- 末尾無音の長さチェック

#### 判断基準

| 末尾無音 | 判定 | アクション |
|----------|------|-----------|
| 2秒未満 | OK | 問題なし |
| 2-3秒 | 許容 | 許容範囲 |
| 3秒以上 | 問題 | Root.tsx/script.ts確認 |
| 10秒以上 | 重大 | playbackRate二重調整疑い |

### 検証3: 目視確認

```bash
open out/video.mp4
```

#### 確認項目

- [ ] セリフが最後まで再生される
- [ ] 口パクが音声と同期している
- [ ] 末尾に不自然な無音がない
- [ ] 字幕とキャラクターが正しく表示される

---

## トラブルシューティング

### 音声が途切れる

**原因**: max_tokensが短すぎる

```python
# NG: 固定値
max_tokens = 300

# OK: セリフ長に応じて動的に
estimated_duration = max(len(text) * 0.4, 3.0)
max_tokens = int(estimated_duration * 12.5) + 100
```

### 末尾に長い無音

**原因**: playbackRate調整の不整合

1. generate-voices-qwen.py: `frames = duration / PLAYBACK_RATE * FPS`
2. Root.tsx: そのまま`durationInFrames + pauseAfter`を使用
3. Main.tsx: そのまま使用（二度割りしない）

### セリフが切れる

**原因**: 二重playbackRate調整

Main.tsxの`getAdjustedFrames`を確認:

```typescript
// NG: 二重調整
const getAdjustedFrames = (frames) => Math.ceil(frames / playbackRate);

// OK: そのまま使用
const getAdjustedFrames = (frames) => frames;
```

### numpy.bool_のJSONエラー

```python
# NG
mouth_data.append(rms > threshold)

# OK
mouth_data.append(bool(rms > threshold))
```

---

## スクリプト一覧

| スクリプト | 用途 |
|-----------|------|
| [scripts/generate-voices-qwen.py](scripts/generate-voices-qwen.py) | 音声生成テンプレート |
| [scripts/verify-voices.py](scripts/verify-voices.py) | Whisper検証 |
| [scripts/analyze-video-audio.py](scripts/analyze-video-audio.py) | 動画音声解析 |

---

## チェックリスト

動画生成完了前に必ず確認:

- [ ] `verify-voices.py` で平均類似度70%以上
- [ ] `analyze-video-audio.py` で末尾無音3秒未満
- [ ] `open out/video.mp4` で目視確認
- [ ] セリフが途切れていない
- [ ] 口パクが自然

**すべてパスするまで「完了」と報告してはならない。**

#!/usr/bin/env python3
"""
Qwen3-TTS音声一括生成スクリプト（テンプレート）

使用方法:
  .venv/bin/python scripts/generate-voices-qwen.py

前提条件:
  - Apple Silicon Mac（MLX使用）
  - .venvにmlx-audio>=0.3.0, soundfile, numpy がインストールされていること
    pip install git+https://github.com/Blaizzy/mlx-audio.git soundfile numpy

重要な注意点:
  1. フレーム計算: frames = duration / PLAYBACK_RATE * FPS
     → durationInFramesは「playbackRate考慮済み」の値として出力
     → Main.tsx/Root.tsxで二度割りしないこと！

  2. max_tokens: セリフ長に応じて動的に設定
     → 短すぎると音声が途切れる
     → 12.5トークン/秒 + 余裕を持たせる

  3. 口パクデータ: numpy.bool_ → Python boolに変換必須
     → JSONシリアライズ時にエラーになる
"""

import re
import time
import json
import warnings
from pathlib import Path

import numpy as np
import soundfile as sf
from mlx_audio.tts import load

# Suppress tokenizer warning
warnings.filterwarnings("ignore", message=".*incorrect regex pattern.*")

# ルートディレクトリ
ROOT_DIR = Path(__file__).parent.parent
SCRIPT_PATH = ROOT_DIR / "src" / "data" / "script.ts"
OUTPUT_DIR = ROOT_DIR / "public" / "voices"

# 動画設定（config.tsと合わせる）
FPS = 30
PLAYBACK_RATE = 1.2

# 口パク用設定
WAVEFORM_FPS = 30

# キャラクター設定（Qwen-TTS用voice instruct）
CHARACTER_INSTRUCTS = {
    "zundamon": "元気で明るく可愛らしい若い女の子の声。語尾に特徴があり、ハキハキとした話し方",
    "metan": "落ち着いた大人っぽい女性の声。上品で穏やかな話し方",
}


def parse_script_ts(script_path: Path) -> list[dict]:
    """script.tsからセリフデータをパース"""
    content = script_path.read_text(encoding="utf-8")

    match = re.search(r'export const scriptData[^=]*=\s*\[([\s\S]*?)\];', content)
    if not match:
        raise ValueError("scriptData not found in script.ts")

    data_str = match.group(1)
    lines = []

    pattern = r'\{\s*id:\s*(\d+),\s*character:\s*"([^"]+)",\s*text:\s*"([^"]+)"[^}]*voiceFile:\s*"([^"]+)"'
    for m in re.finditer(pattern, data_str):
        lines.append({
            "id": int(m.group(1)),
            "character": m.group(2),
            "text": m.group(3),
            "voiceFile": m.group(4),
        })

    return lines


def extract_mouth_data(audio: np.ndarray, sample_rate: int, target_fps: int = 30) -> list[bool]:
    """
    音声波形から口パク用のデータを抽出

    重要: numpy.bool_をPython boolに変換すること！
    """
    samples_per_frame = sample_rate // target_fps
    abs_audio = np.abs(audio)
    mouth_data = []
    threshold = 0.02  # 調整可能

    for i in range(0, len(audio), samples_per_frame):
        chunk = abs_audio[i:i + samples_per_frame]
        if len(chunk) > 0:
            rms = np.sqrt(np.mean(chunk ** 2))
            # 重要: numpy.bool_ではなくPython boolに変換
            mouth_data.append(bool(rms > threshold))
        else:
            mouth_data.append(False)

    return mouth_data


def main():
    print("=" * 60)
    print("Qwen3-TTS 音声一括生成")
    print("=" * 60)

    # 出力ディレクトリ作成
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # モデルロード
    print("\nモデルをロード中...")
    model_name = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit"
    print(f"  モデル: {model_name}")

    tts = load(model_name)
    print("  ロード完了！")

    # スクリプトデータ読み込み
    print("\nスクリプトデータを読み込んでいます...")
    script_data = parse_script_ts(SCRIPT_PATH)
    print(f"  {len(script_data)}件のセリフを検出")

    durations = []
    all_mouth_data = {}

    print("\n音声を生成しています...")
    print("-" * 60)

    for line in script_data:
        output_path = OUTPUT_DIR / line["voiceFile"]
        character = line["character"]
        text = line["text"]

        print(f"\n  [{line['id']:02d}] {character}: {text[:30]}...")

        # max_tokensを動的に設定
        # 重要: 短すぎると音声が途切れる！
        estimated_duration = max(len(text) * 0.4, 3.0)
        max_tokens = int(estimated_duration * 12.5) + 100

        # Voice Designモードで音声生成
        voice_instruct = CHARACTER_INSTRUCTS.get(character, "")

        start_time = time.time()
        result = tts.generate(
            text=text,
            voice_instruct=voice_instruct,
            max_tokens=max_tokens,
        )
        elapsed = time.time() - start_time

        audio = result["audio"]
        sample_rate = result["sample_rate"]

        # 保存
        sf.write(str(output_path), audio, sample_rate)

        # 長さ計算
        duration = len(audio) / sample_rate

        # 重要: フレーム計算（playbackRateを考慮）
        # playbackRate=1.2なら1.2倍速再生なので、動画上の時間は duration/1.2
        frames = int(duration / PLAYBACK_RATE * FPS)

        # 口パクデータ抽出
        # playbackRate考慮したFPSでサンプリング
        adjusted_fps = int(WAVEFORM_FPS * PLAYBACK_RATE)
        mouth_data = extract_mouth_data(audio, sample_rate, adjusted_fps)
        all_mouth_data[line["voiceFile"]] = mouth_data

        print(f"      長さ: {duration:.2f}秒 → {frames}フレーム（{elapsed:.1f}秒で生成）")

        durations.append({
            "id": line["id"],
            "file": line["voiceFile"],
            "duration": round(duration, 2),
            "frames": frames,
        })

    # durations.json出力
    durations_path = OUTPUT_DIR / "durations.json"
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2, ensure_ascii=False)
    print(f"\n  durations.json を出力しました")

    # mouth-data.json出力
    mouth_data_path = OUTPUT_DIR / "mouth-data.json"
    with open(mouth_data_path, "w", encoding="utf-8") as f:
        json.dump(all_mouth_data, f, ensure_ascii=False)
    print(f"  mouth-data.json を出力しました")

    # TypeScript形式でも出力
    ts_path = ROOT_DIR / "src" / "data" / "mouth-data.generated.ts"
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write("// 自動生成ファイル - 編集しないでください\n")
        f.write("// Generated by generate-voices-qwen.py\n\n")
        f.write("export const MOUTH_DATA: Record<string, boolean[]> = ")
        json.dump(all_mouth_data, f, ensure_ascii=False)
        f.write(";\n")
    print(f"  mouth-data.generated.ts を出力しました")

    print("\n" + "=" * 60)
    print("完了！")
    print("=" * 60)
    print("\n次のステップ:")
    print("  1. script.ts の durationInFrames を durations.json の値で更新")
    print("  2. npm run build で動画をビルド")
    print("  3. 検証スクリプトで確認:")
    print("     .venv/bin/python scripts/verify-voices.py")
    print("     .venv/bin/python scripts/analyze-video-audio.py out/video.mp4")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
音声検証スクリプト - Whisperで文字起こしして元テキストと比較

使用方法:
  .venv/bin/python scripts/verify-voices.py

前提条件:
  - mlx-whisperがインストールされていること
    pip install mlx-whisper
"""

import re
import json
from pathlib import Path
from difflib import SequenceMatcher

# mlx-whisperのインポート
try:
    import mlx_whisper
except ImportError:
    print("mlx-whisperがインストールされていません。")
    print("pip install mlx-whisper でインストールしてください。")
    exit(1)

# ルートディレクトリ
ROOT_DIR = Path(__file__).parent.parent
SCRIPT_PATH = ROOT_DIR / "src" / "data" / "script.ts"
VOICES_DIR = ROOT_DIR / "public" / "voices"


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


def normalize_text(text: str) -> str:
    """テキストを正規化（比較用）"""
    # 句読点や記号を除去
    text = re.sub(r'[、。！？!?,.\s]+', '', text)
    # カタカナをひらがなに変換
    text = text.translate(str.maketrans(
        'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョー',
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉっゃゅょー'
    ))
    return text.lower()


def calculate_similarity(text1: str, text2: str) -> float:
    """2つのテキストの類似度を計算（0-1）"""
    norm1 = normalize_text(text1)
    norm2 = normalize_text(text2)
    return SequenceMatcher(None, norm1, norm2).ratio()


def main():
    print("=" * 60)
    print("音声検証スクリプト（Whisper文字起こし）")
    print("=" * 60)

    # スクリプトデータ読み込み
    print("\nスクリプトデータを読み込んでいます...")
    script_data = parse_script_ts(SCRIPT_PATH)
    print(f"  {len(script_data)}件のセリフを検出")

    # Whisperモデル設定（デフォルトを使用）
    # mlx-community/whisper-tiny, whisper-small, whisper-medium などが利用可能
    model_name = "mlx-community/whisper-tiny"  # デフォルト（高速だが精度は低め）

    results = []
    total_similarity = 0
    warnings = []

    print("\n音声を検証しています...")
    print("-" * 60)

    for line in script_data:
        voice_path = VOICES_DIR / line["voiceFile"]

        if not voice_path.exists():
            print(f"  [{line['id']:02d}] ⚠️ ファイルが見つかりません: {voice_path}")
            warnings.append(f"ID {line['id']}: ファイルが見つかりません")
            continue

        # Whisperで文字起こし（デフォルトモデル使用）
        result = mlx_whisper.transcribe(
            str(voice_path),
            language="ja",
        )
        transcribed = result["text"].strip()

        # 類似度計算
        original_text = line["text"]
        similarity = calculate_similarity(original_text, transcribed)
        total_similarity += similarity

        # 結果表示
        status = "✅" if similarity >= 0.7 else "⚠️" if similarity >= 0.5 else "❌"
        print(f"\n  [{line['id']:02d}] {line['character']} {status} 類似度: {similarity:.1%}")
        print(f"      元テキスト: {original_text[:50]}{'...' if len(original_text) > 50 else ''}")
        print(f"      文字起こし: {transcribed[:50]}{'...' if len(transcribed) > 50 else ''}")

        if similarity < 0.7:
            warnings.append(f"ID {line['id']}: 類似度 {similarity:.1%} - テキストが一致しない可能性")

        results.append({
            "id": line["id"],
            "character": line["character"],
            "original": original_text,
            "transcribed": transcribed,
            "similarity": round(similarity, 3),
        })

    # サマリー
    avg_similarity = total_similarity / len(script_data) if script_data else 0

    print("\n" + "=" * 60)
    print("検証結果サマリー")
    print("=" * 60)
    print(f"  検証ファイル数: {len(results)}")
    print(f"  平均類似度: {avg_similarity:.1%}")

    if warnings:
        print(f"\n⚠️ 警告 ({len(warnings)}件):")
        for w in warnings:
            print(f"    - {w}")
    else:
        print("\n✅ すべての音声が正常に検証されました！")

    # 結果をJSONで保存
    output_path = VOICES_DIR / "verification-results.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "average_similarity": round(avg_similarity, 3),
            "warnings": warnings,
            "results": results,
        }, f, indent=2, ensure_ascii=False)

    print(f"\n  検証結果: {output_path}")

    # 閾値チェック
    if avg_similarity < 0.6:
        print("\n❌ 平均類似度が60%未満です。音声生成に問題がある可能性があります。")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())

import { CHARACTERS, CharacterId as GeneratedCharacterId } from "./settings.generated";

// 動画設定
export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  playbackRate: 1.2, // 再生速度（音声生成時に考慮）
};

// カラーパレット（黒板風デザイン）
export const COLORS = {
  background: "#ffffff",      // 外側の白背景
  blackboard: "#2d5a3d",      // 黒板の緑
  blackboardBorder: "#8B4513", // 黒板の茶色フチ
  text: "#ffffff",            // 白文字
  textMuted: "#e0e0e0",
  primary: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  pink: "#ec4899",
  // キャラクター固有カラー（characters.yamlのcolorと同じ）
  zundamon: "#228B22",        // フォレストグリーン（暗め）
  metan: "#FF1493",           // ディープピンク
  aoi: "#00BFFF",             // ディープスカイブルー
  murasaki: "#9932CC",        // ダークオーキッド
  mofumo: "#FFB6C1",          // ライトピンク
  yoru: "#4169E1",            // ロイヤルブルー
};

// キャラクター定義（settings.generated.tsから生成）
export type CharacterId = GeneratedCharacterId;

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  voicevoxSpeakerId: number;
  position: "left" | "right";
  color: string;
  // 画像設定（口パクアニメーション用）
  images: {
    mouthOpen: string; // 口開き画像パス
    mouthClose: string; // 口閉じ画像パス
  };
  flipX?: boolean; // 画像を左右反転するか
}

// デフォルトキャラクター設定（characters.yamlから動的生成）
// characters.yamlで定義されたキャラクターをCharacterConfig形式に変換
export const DEFAULT_CHARACTERS: CharacterConfig[] = Object.entries(CHARACTERS).map(
  ([id, char]) => ({
    id: id as CharacterId,
    name: char.name,
    voicevoxSpeakerId: char.position === "right" ? 3 : 2, // 右:3, 左:2
    position: char.position,
    color: char.color,
    images: {
      mouthOpen: `images/${id}/mouth_open.png`,
      mouthClose: `images/${id}/mouth_close.png`,
    },
    flipX: false,
  })
);

// キャラクターIDからspeakerIdを取得するマップ（characters.yamlから動的生成）
export const characterSpeakerMap: Record<CharacterId, number> = Object.fromEntries(
  Object.entries(CHARACTERS).map(([id, char]) => [
    id,
    char.position === "right" ? 3 : 2, // 右:3, 左:2
  ])
) as Record<CharacterId, number>;

// シーン背景タイプ
export type BackgroundType = "gradient" | "solid" | "image";

export interface SceneConfig {
  id: number;
  title: string;
  background: BackgroundType;
  backgroundColor?: string;
  backgroundImage?: string;
}

// VOICEVOX設定
export const VOICEVOX_CONFIG = {
  host: "http://localhost:50021",
  defaultSpeedScale: 1.0,
  defaultPitchScale: 0.0,
  defaultIntonationScale: 1.0,
  defaultVolumeScale: 1.0,
};

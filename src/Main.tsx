import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile, Loop } from "remotion";
import { loadFont } from "@remotion/google-fonts/MPLUSRounded1c";
import { scriptData, scenes, ScriptLine, bgmConfig } from "./data/script";
import { COLORS, VIDEO_CONFIG, CharacterId, DEFAULT_CHARACTERS } from "./config";
import { Subtitle } from "./components/Subtitle";
import { Character } from "./components/Character";
import { SceneVisuals } from "./components/SceneVisuals";
import { MOUTH_DATA } from "./data/mouth-data.generated";

// 現在のセリフに基づいてキャラクターペアを取得
// 現在話しているキャラを必ず表示し、同じシーンの直近の別キャラをペアとして表示
const getSceneCharacters = (
  sceneId: number,
  currentLine: ScriptLine | null,
): [CharacterId | null, CharacterId | null] => {
  const sceneLines = scriptData.filter(line => line.scene === sceneId);
  const characters = [...new Set(sceneLines.map(line => line.character))];

  if (characters.length === 0) return [null, null];

  // 1人だけの場合
  if (characters.length === 1) {
    const char = DEFAULT_CHARACTERS.find(c => c.id === characters[0]);
    if (char?.position === "left") return [characters[0], null];
    return [null, characters[0]];
  }

  // 2人の場合（ペア対話）：デフォルト位置で左右に配置
  if (characters.length === 2) {
    const leftChars = characters.filter(c =>
      DEFAULT_CHARACTERS.find(dc => dc.id === c)?.position === "left"
    );
    const rightChars = characters.filter(c =>
      DEFAULT_CHARACTERS.find(dc => dc.id === c)?.position === "right"
    );
    const leftChar = leftChars[0] || rightChars[1] || characters[0];
    const rightChar = rightChars[0] || leftChars[1] || characters[1] || characters[0];
    return [leftChar as CharacterId, rightChar as CharacterId];
  }

  // 3人以上の場合（エンディング等）：現在のスピーカーを中心に表示
  if (currentLine) {
    const currentChar = currentLine.character;
    const currentConfig = DEFAULT_CHARACTERS.find(c => c.id === currentChar);
    const currentIndex = sceneLines.findIndex(line => line.id === currentLine.id);

    // 同じシーン内の直前の別キャラを探す
    let otherChar: CharacterId | null = null;
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (sceneLines[i].character !== currentChar) {
        otherChar = sceneLines[i].character;
        break;
      }
    }
    // 見つからなければ直後から探す
    if (!otherChar) {
      for (let i = currentIndex + 1; i < sceneLines.length; i++) {
        if (sceneLines[i].character !== currentChar) {
          otherChar = sceneLines[i].character;
          break;
        }
      }
    }

    // ペアがいない場合は1人だけ表示
    if (!otherChar) {
      if (currentConfig?.position === "left") return [currentChar, null];
      return [null, currentChar];
    }

    // 現在のキャラの位置に基づいて左右を決定
    if (currentConfig?.position === "left") {
      return [currentChar, otherChar];
    } else {
      return [otherChar, currentChar];
    }
  }

  // フォールバック：最初の2キャラを使用
  const leftChars = characters.filter(c =>
    DEFAULT_CHARACTERS.find(dc => dc.id === c)?.position === "left"
  );
  const rightChars = characters.filter(c =>
    DEFAULT_CHARACTERS.find(dc => dc.id === c)?.position === "right"
  );
  const leftChar = leftChars[0] || characters[0];
  const rightChar = rightChars[0] || characters[1] || characters[0];
  return [leftChar as CharacterId, rightChar as CharacterId];
};

// Google Fontsをロード
const { fontFamily } = loadFont();

// durationInFramesはすでにplaybackRate考慮済みなのでそのまま使用
// （generate-voices-qwen.pyで duration / playbackRate * FPS として計算済み）
const getAdjustedFrames = (frames: number): number => frames;

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 現在のセリフを計算
  let accumulatedFrames = 0;
  let currentLine: ScriptLine | null = null;
  let currentLineStartFrame = 0;
  let currentScene = 1;
  let isSpeaking = false;
  let frameInLine = 0; // セリフ内での現在フレーム位置

  for (const line of scriptData) {
    const adjustedDuration = getAdjustedFrames(line.durationInFrames);
    const adjustedPause = getAdjustedFrames(line.pauseAfter);
    const lineEndFrame = accumulatedFrames + adjustedDuration + adjustedPause;

    if (frame >= accumulatedFrames && frame < lineEndFrame) {
      currentLine = line;
      currentLineStartFrame = accumulatedFrames;
      currentScene = line.scene;
      // 音声再生中は adjustedDuration の間だけ
      isSpeaking = frame < accumulatedFrames + adjustedDuration;
      frameInLine = frame - accumulatedFrames;
      break;
    }
    accumulatedFrames = lineEndFrame;
    currentScene = line.scene;
  }

  // 現在のセリフの口パクデータを取得
  const currentMouthData = currentLine
    ? MOUTH_DATA[currentLine.voiceFile] ?? []
    : [];

  const sceneInfo = scenes.find((s) => s.id === currentScene) || scenes[0];

  // 各セリフの開始フレームを計算
  const getLineStartFrame = (index: number): number => {
    let startFrame = 0;
    for (let i = 0; i < index; i++) {
      startFrame +=
        getAdjustedFrames(scriptData[i].durationInFrames) +
        getAdjustedFrames(scriptData[i].pauseAfter);
    }
    return startFrame;
  };

  // 各セリフの再生速度調整済み長さを取得
  const getLineDuration = (line: ScriptLine): number =>
    getAdjustedFrames(line.durationInFrames);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      }}
    >
      {/* 黒板背景 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          bottom: 160,
          background: COLORS.blackboard,
          borderRadius: 8,
        }}
      />
      {/* 黒板の茶色フチ（下部） */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 160,
          height: 24,
          background: COLORS.blackboardBorder,
          borderRadius: "0 0 8px 8px",
        }}
      />
      {/* BGM再生 */}
      {bgmConfig && (
        <Audio
          src={staticFile(`bgm/${bgmConfig.src}`)}
          volume={bgmConfig.volume ?? 0.3}
          loop={bgmConfig.loop ?? true}
        />
      )}

      {/* 音声再生 */}
      {scriptData.map((line, index) => {
        const startFrame = getLineStartFrame(index);
        return (
          <Sequence
            key={`audio-${line.id}`}
            from={startFrame}
            durationInFrames={getLineDuration(line)}
            premountFor={fps}
          >
            <Audio
              src={staticFile(`voices/${line.voiceFile}`)}
              playbackRate={VIDEO_CONFIG.playbackRate}
            />
            {/* 効果音再生 */}
            {line.se && (
              <Audio
                src={staticFile(`se/${line.se.src}`)}
                volume={line.se.volume ?? 1}
              />
            )}
          </Sequence>
        );
      })}

      {/* シーンごとのビジュアル */}
      <SceneVisuals
        scene={currentScene}
        lineId={currentLine?.id ?? null}
        frame={frame}
        fps={fps}
        visual={currentLine?.visual}
      />

      {/* キャラクター（シーンに応じて動的に切り替え） */}
      {(() => {
        const [leftChar, rightChar] = getSceneCharacters(currentScene, currentLine);
        return (
          <>
            {leftChar && (
              <Character
                characterId={leftChar}
                isSpeaking={isSpeaking && currentLine?.character === leftChar}
                emotion={currentLine?.character === leftChar ? currentLine.emotion : "normal"}
                mouthData={currentLine?.character === leftChar ? currentMouthData : []}
                frameInLine={frameInLine}
                forcePosition="left"
              />
            )}
            {rightChar && (
              <Character
                characterId={rightChar}
                isSpeaking={isSpeaking && currentLine?.character === rightChar}
                emotion={currentLine?.character === rightChar ? currentLine.emotion : "normal"}
                mouthData={currentLine?.character === rightChar ? currentMouthData : []}
                frameInLine={frameInLine}
                forcePosition="right"
              />
            )}
          </>
        );
      })()}

      {/* 字幕 */}
      {currentLine && (
        <Sequence
          key={`subtitle-${currentLine.id}`}
          from={currentLineStartFrame}
          durationInFrames={getLineDuration(currentLine)}
        >
          <Subtitle
            text={currentLine.displayText ?? currentLine.text}
            character={currentLine.character}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

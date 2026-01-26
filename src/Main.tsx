import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile, Loop } from "remotion";
import { loadFont } from "@remotion/google-fonts/MPLUSRounded1c";
import { scriptData, scenes, ScriptLine, bgmConfig } from "./data/script";
import { COLORS, VIDEO_CONFIG } from "./config";
import { Subtitle } from "./components/Subtitle";
import { Character } from "./components/Character";
import { SceneVisuals } from "./components/SceneVisuals";
import { MOUTH_DATA } from "./data/mouth-data.generated";

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

      {/* キャラクター */}
      <Character
        characterId="murasaki"
        isSpeaking={isSpeaking && currentLine?.character === "murasaki"}
        emotion={currentLine?.character === "murasaki" ? currentLine.emotion : "normal"}
        mouthData={currentLine?.character === "murasaki" ? currentMouthData : []}
        frameInLine={frameInLine}
      />
      <Character
        characterId="aoi"
        isSpeaking={isSpeaking && currentLine?.character === "aoi"}
        emotion={currentLine?.character === "aoi" ? currentLine.emotion : "normal"}
        mouthData={currentLine?.character === "aoi" ? currentMouthData : []}
        frameInLine={frameInLine}
      />

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

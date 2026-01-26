import { Composition } from "remotion";
import { Main } from "./Main";
import { scriptData } from "./data/script";
import { VIDEO_CONFIG } from "./config";

// 動画の総フレーム数を計算
// durationInFramesはすでにplaybackRate考慮済み（generate-voices-qwen.pyで計算済み）
// pauseAfterは動画上のフレーム数なのでそのまま使用
const calculateTotalFrames = () => {
  let total = 30; // オープニング用の余白（1秒）
  for (const line of scriptData) {
    total += line.durationInFrames + line.pauseAfter;
  }
  total += 15; // エンディング用の余白（0.5秒）
  return total;
};

export const RemotionRoot: React.FC = () => {
  const totalFrames = calculateTotalFrames();

  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={totalFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};

import { useRef } from "react";
import { useHorizontalDragging } from "app/custonHooks/useHorizontalDragging";
import FrameThumbnail from "app/Components/FrameThumbnail/FrameThumbnail";
import styles from "./DraggableVideoFrameRibbon.module.scss";

const DraggableVideoFrameRibbon = ({ videoModel, dragPositionFixInPx }) => {
  const onMouseMoveCallback = (newX, video) => {
    video.videoStart = (newX + dragPositionFixInPx) / 100;
  };

  // this fix is required because the ribbons are basically a flexed row of relative div elements;
  // it doesn't depend on the position of the previous video ribbons
  const previousVideosRibbonWidth = videoModel.previousVideosDuration * 100;
  const xPositionRequiredFixInPx = dragPositionFixInPx - previousVideosRibbonWidth;

  const [dragRef, x, isDragging] = useHorizontalDragging(videoModel, xPositionRequiredFixInPx, onMouseMoveCallback);

  const isFirstRenderRef = useRef(true);

  const left = isFirstRenderRef.current ? 0 : x;

  isFirstRenderRef.current = false;

  return (
    <div
      ref={dragRef}
      style={{
        position: "relative",
        left: left,
        border: `1px solid ${isDragging ? "blue" : "gray"}`,
        backgroundColor: "#141e2b"
      }}
      className={styles["one-video-frame-ribbon"]}
    >
      {videoModel.thumbnails.map((t, i, a) => (
        <FrameThumbnail key={`${videoModel.objectUrl}-thumbnail-${i}`} imgSrc={t} width={getFrameThumbnailWidth(i, a, videoModel)} />
      ))}
    </div>
  );
};

const getFrameThumbnailWidth = (frameIndex, allFrames, videoModel) => {
  const isLastInArray = frameIndex === allFrames.length - 1;

  if (!isLastInArray) {
    return 25;
  }

  const frameDuration = 0.25;

  // get length of the last frame, between 0 and 0.25 seconds
  const lastFrameDuration = videoModel.duration % frameDuration;

  // we can do that because frame lasts for 0.25 seconds and its default width is 25 px
  // so 0.25s has 25 px width and, for example, 0.142s should have 14.2px of width
  return lastFrameDuration * 100;
};

export default DraggableVideoFrameRibbon;

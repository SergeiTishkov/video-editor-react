import styles from "./FrameRibbonComponent.module.scss";
import classnames from "classnames";
import ThumbnailComponent from "Components/ThumbnailComponent/ThumbnailComponent";

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

const FrameRibbonComponent = ({ addedVideos, handleDrop, currentTime }) => {
  const handleDragEnterInternal = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeaveInternal = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOverInternal = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDropInternal = e => {
    e.preventDefault();
    e.stopPropagation();

    handleDrop && handleDrop(e);
  };

  return (
    <>
      <div
        className={addedVideos.length ? classnames(styles["drag-drop-zone"], styles["not-empty"]) : styles["drag-drop-zone"]}
        onDrop={e => handleDropInternal(e)}
        onDragOver={e => handleDragOverInternal(e)}
        onDragEnter={e => handleDragEnterInternal(e)}
        onDragLeave={e => handleDragLeaveInternal(e)}
      >
        <div className={styles["frame-ribbon-container"]}>
          {addedVideos.length ? (
            addedVideos.map(v => (
              <div className={styles["one-video-frame-ribbon"]}>
                {v.thumbnails.map((t, i, a) => (
                  <ThumbnailComponent key={`${v.objectUrl}-thumbnail-${i}`} imgSrc={t} width={getFrameThumbnailWidth(i, a, v)} />
                ))}
              </div>
            ))
          ) : (
            <p>Drag videos here to play them</p>
          )}
        </div>

        <div className={styles["play-marker-container"]}>
          <span style={{ marginLeft: `${currentTime * 100}px` }} className={styles["play-marker"]} />
        </div>
      </div>
    </>
  );
};

export default FrameRibbonComponent;

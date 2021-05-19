import styles from "./FrameRibbon.module.scss";
import classnames from "classnames";
import DraggableVideoFrameRibbon from "Components/DraggableVideoFrameRibbon/DraggableVideoFrameRibbon";

const FrameRibbon = ({ addedVideos, handleDrop, currentTime }) => {
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

    handleDrop?.(e);
  };

  const padding = 7;

  return (
    <>
      <div
        style={{ padding: `${7}px` }}
        className={addedVideos.length ? classnames(styles["drag-drop-zone"], styles["not-empty"]) : styles["drag-drop-zone"]}
        onDrop={e => handleDropInternal(e)}
        onDragOver={e => handleDragOverInternal(e)}
        onDragEnter={e => handleDragEnterInternal(e)}
        onDragLeave={e => handleDragLeaveInternal(e)}
      >
        <div className={styles["frame-ribbon-container"]}>
          {addedVideos.length ? (
            addedVideos.map(v => <DraggableVideoFrameRibbon videoModel={v} dragPositionFixInPx={-padding} />)
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

export default FrameRibbon;

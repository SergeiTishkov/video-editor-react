import styles from "./DragAndDropComponent.module.scss";
import classnames from "classnames";
import ThumbnailComponent from "Components/ThumbnailComponent/ThumbnailComponent";

const DragAndDropComponent = ({ addedVideos, handleDrop, currentTime }) => {
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
        <div>
          {addedVideos.length ? (
            addedVideos.flatMap(v => v.thumbnails.map((t, i) => <ThumbnailComponent key={`${v.objectUrl}-thumbnail-${i}`} imgSrc={t} />))
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

export default DragAndDropComponent;

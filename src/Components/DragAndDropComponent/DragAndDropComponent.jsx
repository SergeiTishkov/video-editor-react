import styles from "./DragAndDropComponent.module.scss";
import classnames from "classnames";
import ThumbnailComponent from "Components/ThumbnailComponent/ThumbnailComponent";

const DragAndDropComponent = ({ addedVideos, handleDrop }) => {
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
        {addedVideos.length ? addedVideos.flatMap(v => v.thumbnails.map(t => <ThumbnailComponent imgSrc={t} />)) : <p>Drag files here to upload</p>}
      </div>
    </>
  );
};

export default DragAndDropComponent;

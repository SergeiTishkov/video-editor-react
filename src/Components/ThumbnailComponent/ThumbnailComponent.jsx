import styles from "./ThumbnailComponent.module.scss";

/**
 * Component that draws a frame of a video
 * @param {{imgSrc: string; width: string}} props - width is a number between 0 and 25
 * @returns
 */
const ThumbnailComponent = ({ imgSrc, width = 25 }) => {
  if (typeof width !== "number" || width < 0 || width > 25) {
    throw new Error(`ThumbnailComponent - width prop must be a number between 0 and 25, but it was ${width}`);
  }

  return (
    <div style={{ width: `${width}px` }} className={styles["container"]}>
      <img className={styles["img"]} src={imgSrc} draggable="false" />
    </div>
  );
};

export default ThumbnailComponent;

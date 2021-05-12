import React from "react";
import styles from "./VideoPlayerComponent.module.scss";

const VideoPlayerComponent = ({videoSrc}) => {
  return (
    <div className={styles["container"]}>
      <video src={videoSrc} {...(videoSrc ? { controls: true } : {})} />
    </div>
  );
};

export default VideoPlayerComponent;

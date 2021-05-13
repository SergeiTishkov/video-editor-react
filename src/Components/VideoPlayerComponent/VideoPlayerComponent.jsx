import React from "react";
import styles from "./VideoPlayerComponent.module.scss";
import classNames from "classnames";

const VideoPlayerComponent = ({ videoSrc, onTimeUpdate }) => {
  const [paused, setPaused] = React.useState(true);
  const videoRef = React.useRef();

  const togglePlayPause = () => {
    paused ? videoRef.current.play() : videoRef.current.pause();

    setPaused(!paused);
  };

  return (
    <div className={classNames(styles["component-container"], videoSrc ? "" : styles["no-content"])}>
      <div className={styles["video-container"]}>
        <video ref={videoRef} src={videoSrc} onTimeUpdate={e => onTimeUpdate && onTimeUpdate(e, videoRef.current)} />
      </div>
      <div className={styles["controls-container"]}>
        <button onClick={togglePlayPause}>{paused ? "play" : "pause"}</button>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./VideoPlayer.module.scss";
import classNames from "classnames";

const VideoPlayer = ({ video: { objectUrl: videoSrc, duration }, height, active, onTimeUpdate, onEnded }, ref) => {
  const [paused, setPaused] = useState(true);
  const videoRef = useRef();

  useImperativeHandle(ref, () => ({
    get duration() {
      return duration;
    },
    play: () => {
      videoRef.current.play();
      setPaused(false);
    }
  }));

  const togglePlayPause = () => {
    paused ? videoRef.current.play() : videoRef.current.pause();

    setPaused(!paused);
  };

  const onEndedInternal = e => {
    setPaused(true);

    if (onEnded) {
      onEnded(e, videoRef.current);
    }
  };

  if (!videoSrc) {
    return (
      <div className={styles["component-container"]}>
        <div style={{ display: active ? "block" : "none", backgroundColor: "black", height: `${height || 200}px`, width: `${(height || 200) * 1.5}px` }} />
      </div>
    );
  }

  return (
    <div className={classNames(styles["component-container"], !active ? styles["no-content"] : "")}>
      <div className={styles["video-container"]}>
        <video
          {...(height ? { height } : {})}
          ref={videoRef}
          src={videoSrc}
          onTimeUpdate={e => onTimeUpdate?.(e, videoRef.current)}
          onEnded={onEndedInternal}
        />
      </div>
      <div className={styles["controls-container"]}>
        <button onClick={togglePlayPause}>{paused ? "play" : "pause"}</button>
      </div>
    </div>
  );
};

export default forwardRef(VideoPlayer);

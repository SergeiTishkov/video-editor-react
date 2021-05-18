import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./VideoPlayerComponent.module.scss";
import classNames from "classnames";

const VideoPlayerComponent = ({ videoSrc, active, onTimeUpdate, onEnded }, ref) => {
  const [paused, setPaused] = useState(true);
  const videoRef = useRef();

  useImperativeHandle(ref, () => ({
    get duration() {
      return videoRef.current.duration;
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

  return (
    <div className={classNames(styles["component-container"], !videoSrc || !active ? styles["no-content"] : "")}>
      <div className={styles["video-container"]}>
        <video height="500" ref={videoRef} src={videoSrc} onTimeUpdate={e => onTimeUpdate?.(e, videoRef.current)} onEnded={onEndedInternal} />
      </div>
      <div className={styles["controls-container"]}>
        <button onClick={togglePlayPause}>{paused ? "play" : "pause"}</button>
      </div>
    </div>
  );
};

export default forwardRef(VideoPlayerComponent);

import { useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./VideoPlayer.module.scss";
import classNames from "classnames";

const VideoPlayer = ({ video: { objectUrl: videoSrc, duration }, height, active, onTimeUpdate, onEnded }, ref) => {
  const videoRef = useRef();

  useImperativeHandle(ref, () => ({
    get duration() {
      return duration;
    },
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause()
  }));

  if (!videoSrc) {
    return (
      <div className={classNames(styles["component-container"], !active ? styles["no-content"] : "")}>
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
          onEnded={e => onEnded?.(e, videoRef.current)}
        />
      </div>
    </div>
  );
};

export default forwardRef(VideoPlayer);

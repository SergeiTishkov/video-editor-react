import { useState, useRef, useEffect } from "react";
import "./App.css";
import { extractVideoModelFromBlob } from "app/utils/extractVideoModelFromBlob";
import VideoPlayer from "./app/Components/VideoPlayer/VideoPlayer";
import FrameRibbon from "./app/Components/FrameRibbon/FrameRibbon";
// import blackFrameSrc from "../assets/images/black-frame-thumbnail.png";

const videoPlayerMaxHeight = 500;

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoPlayerHeight, setVideoPlayerHeight] = useState(0);
  const currentVideoRef = useRef();

  // stands for all the time of the video, i.e. if user has 2 videos without a break 10 seconds long each,
  // and the active video is on 6th second then currentTime is 16 seconds
  const [currentTime, setCurrentTime] = useState(0);

  const fileReaderOnLoad = async data => {
    const videoBlob = new Blob([data.currentTarget.result], { type: "video/mp4" });

    const newVideo = await extractVideoModelFromBlob(videoBlob);

    newVideo.previousVideosDuration = videos.reduce((reducer, video) => reducer + video.duration, 0);

    newVideo.videoStart = newVideo.previousVideosDuration;

    const updatedVideosArray = [...videos, newVideo, { height: 200, thumbnails: [/*blackFrameSrc, blackFrameSrc, blackFrameSrc, blackFrameSrc */] }];

    setVideos(updatedVideosArray);

    const newVideoPlayerHeight = updatedVideosArray
      .map(v => v.height)
      .reduce((reducer, height) => {
        const newMaxInitialVideoHeight = height > reducer ? height : reducer;
        return newMaxInitialVideoHeight < videoPlayerMaxHeight ? newMaxInitialVideoHeight : videoPlayerMaxHeight;
      }, 0);

    setVideoPlayerHeight(newVideoPlayerHeight);
  };

  /**
   * Saves dropped file to the state.
   * @param {*} e Drag and drop event
   */
  const handleFileDrop = e => {
    for (const file of e.dataTransfer.files) {
      const reader = new FileReader();

      reader.onload = fileReaderOnLoad;

      reader.readAsArrayBuffer(file);
    }
  };

  /**
   * Moves the red line of the current playing moment on the frame ribbon
   * @param {*} e - timeUpdateEvent
   * @param {*} v - the <video> HTML element
   */
  const onVideoTimeUpdate = (e, v) => {
    const allVideosBeforeCurrentOne = videos.slice(0, currentVideoIndex);

    const lengthOfPreviousVideos = allVideosBeforeCurrentOne.reduce((acc, next) => acc + next.duration, 0);

    setCurrentTime(lengthOfPreviousVideos + v.currentTime);
  };

  /**
   * Hides the ended video and shows the next one. The next one will be the first one in the list
   * if the ended video was the pre-last.
   */
  const onVideoEnded = () => {
    const nextVideoExists = !!videos[currentVideoIndex + 1];

    const nextVideoIndex = nextVideoExists ? currentVideoIndex + 1 : 0;

    setCurrentVideoIndex(nextVideoIndex);

    if (nextVideoIndex === 0) {
      setCurrentTime(0);
    }
  };

  /**
   * Starts next video on the end of the previous one. If the ended video was the last one, it won't be started.
   * useEffect fires after setCurrentVideoIndex so it starts the <video> that is made visible by setCurrentVideoIndex.
   */
  useEffect(() => {
    // if current video is loaded (false on just loaded web page) and is not the first one
    // (doesn't start the first video again after all videos are ended)
    if (currentVideoRef.current?.duration && currentVideoIndex !== 0) {
      currentVideoRef.current.play();
    }
  }, [currentVideoIndex]);

  return (
    <div className="App">
      {videos.map((v, i) => (
        <VideoPlayer
          key={v.objectUrl}
          ref={i === currentVideoIndex ? currentVideoRef : null}
          videoSrc={v.objectUrl}
          height={videoPlayerHeight}
          active={i === currentVideoIndex}
          onTimeUpdate={onVideoTimeUpdate}
          onEnded={onVideoEnded}
        />
      ))}
      <FrameRibbon addedVideos={videos} handleDrop={handleFileDrop} currentTime={currentTime} />
    </div>
  );
}

export default App;

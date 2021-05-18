import { useState, useRef, useEffect } from "react";
import "./App.css";
import { extractVideoModelFromBlob } from "utils/extractVideoModelFromBlob";
import VideoPlayerComponent from "./Components/VideoPlayerComponent/VideoPlayerComponent";
import FrameRibbonComponent from "./Components/FrameRibbonComponent/FrameRibbonComponent";

function App() {
  const [addedVideos, setAddedVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoRef = useRef();

  // stands for all the time of the video, i.e. if user has 2 videos without a break 10 seconds long each,
  // and the active video is on 6th second then currentTime is 16 seconds
  const [currentTime, setCurrentTime] = useState(0);

  const fileReaderOnLoad = async data => {
    const videoBlob = new Blob([data.currentTarget.result], { type: "video/mp4" });

    const newVideo = await extractVideoModelFromBlob(videoBlob);

    setAddedVideos([...addedVideos, newVideo]);
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
    const allVideosBeforeCurrentOne = addedVideos.slice(0, currentVideoIndex);

    const lengthOfPreviousVideos = allVideosBeforeCurrentOne.reduce((acc, next) => acc + next.duration, 0);

    setCurrentTime(lengthOfPreviousVideos + v.currentTime);
  };

  /**
   * Hides the ended video and shows the next one. The next one will be the first one in the list
   * if the ended video was the pre-last.
   */
  const onVideoEnded = () => {
    const nextVideoExists = !!addedVideos[currentVideoIndex + 1];

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
      {addedVideos?.map((v, i) => (
        <VideoPlayerComponent
          key={v.objectUrl}
          ref={i === currentVideoIndex ? currentVideoRef : null}
          videoSrc={v.objectUrl}
          active={i === currentVideoIndex}
          onTimeUpdate={onVideoTimeUpdate}
          onEnded={onVideoEnded}
        />
      ))}
      <FrameRibbonComponent addedVideos={addedVideos} handleDrop={handleFileDrop} currentTime={currentTime} />
    </div>
  );
}

export default App;

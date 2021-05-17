import { useState, useRef, useEffect } from "react";
import "./App.css";
import { extractVideoModelFromBlob } from "utils/extractVideoModelFromBlob";
import VideoPlayerComponent from "./Components/VideoPlayerComponent/VideoPlayerComponent";
import DragAndDropComponent from "./Components/DragAndDropComponent/DragAndDropComponent";

function App() {
  const [addedVideos, setAddedVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoRef = useRef();

  // stands for the time of the application, that means, if user has 2 videos without a break
  // 10 seconds long each, and the active video is on 6th second then currentTime is 16
  const [currentTime, setCurrentTime] = useState(0);

  const fileReaderOnLoad = async data => {
    const videoBlob = new Blob([data.currentTarget.result], { type: "video/mp4" });

    const newVideo = await extractVideoModelFromBlob(videoBlob);

    setAddedVideos([...addedVideos, newVideo]);
  };

  const handleFileDrop = e => {
    for (const file of e.dataTransfer.files) {
      const reader = new FileReader();

      reader.onload = fileReaderOnLoad;

      reader.readAsArrayBuffer(file);
    }
  };

  const onVideoTimeUpdate = (e, v) => {
    const allVideosBeforeCurrentOne = addedVideos.slice(0, currentVideoIndex);

    const lengthOfPreviousVideos = allVideosBeforeCurrentOne.reduce((acc, next) => acc + next.duration, 0);

    setCurrentTime(lengthOfPreviousVideos + v.currentTime);
  };

  const onVideoEnded = () => {
    const nextVideoExists = !!addedVideos[currentVideoIndex + 1];

    const nextVideoIndex = nextVideoExists ? currentVideoIndex + 1 : 0;

    setCurrentVideoIndex(nextVideoIndex);

    if (nextVideoIndex === 0) {
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    // if current video is loaded and is not the first one (prevents loop replay again and again)
    if (currentVideoRef.current?.video?.duration && currentVideoIndex !== 0) {
      currentVideoRef.current.video.play();
    }
  }, [currentVideoIndex]);

  return (
    <div className="App">
      {addedVideos?.map((v, i) => (
        <VideoPlayerComponent
          ref={i === currentVideoIndex ? currentVideoRef : null}
          videoSrc={v.objectUrl}
          active={i === currentVideoIndex}
          onTimeUpdate={onVideoTimeUpdate}
          onEnded={onVideoEnded}
        />
      ))}
      <DragAndDropComponent addedVideos={addedVideos} handleDrop={handleFileDrop} currentTime={currentTime} />
    </div>
  );
}

export default App;

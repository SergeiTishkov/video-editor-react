import { useState } from "react";
import "./App.css";
import { extractVideoModelFromBlob } from "utils/extractVideoModelFromBlob";
import VideoPlayerComponent from "./Components/VideoPlayerComponent/VideoPlayerComponent";
import DragAndDropComponent from "./Components/DragAndDropComponent/DragAndDropComponent";

function App() {
  const [addedVideos, setAddedVideos] = useState([]);
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
    console.log(v.currentTime)
    setCurrentTime(v.currentTime)
  };

  return (
    <div className="App">
      <VideoPlayerComponent videoSrc={addedVideos?.[0]?.objectUrl} onTimeUpdate={onVideoTimeUpdate} />
      <DragAndDropComponent addedVideos={addedVideos} handleDrop={handleFileDrop} currentTime={currentTime}/>
    </div>
  );
}

export default App;

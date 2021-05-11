import React, { useState } from "react";
import styles from "./DragAndDropComponent.module.scss";

const DragAndDrop = props => {
  const [videoSrc, setVideoSrc] = useState();

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    for (let file of e.dataTransfer.files) {
      var reader = new FileReader();

      reader.onload = function (data) {
        const videoSrc = window.URL.createObjectURL(new Blob([data.currentTarget.result], { type: "video/mp4" }));
        setVideoSrc(videoSrc);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div
        className={styles["drag-drop-zone"]}
        onDrop={e => handleDrop(e)}
        onDragOver={e => handleDragOver(e)}
        onDragEnter={e => handleDragEnter(e)}
        onDragLeave={e => handleDragLeave(e)}
      >
        <p>Drag files here to upload</p>
      </div>
      <video src={videoSrc} {...(videoSrc ? { controls: true } : {})}></video>
    </>
  );
};

export default DragAndDrop;

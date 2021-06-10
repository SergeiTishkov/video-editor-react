import { useContext, useRef } from "react";
import { useHorizontalDragging } from "app/custonHooks/useHorizontalDragging";
import FrameThumbnail from "app/Components/FrameThumbnail/FrameThumbnail";
import styles from "./DraggableVideoFrameRibbon.module.scss";
import MainContext from "app/contexts/MainContext";
import { VideoEvent } from "app/dataModels/VideoEvent";
import { BlackVideoModel } from "app/dataModels/BlackVideoModel";
import { getDurationOfPreviousVideos } from "app/utils/getDurationOfPreviousVideos";

const DraggableVideoFrameRibbon = ({ videoModel, dragPositionFixInPx }) => {
  const { blackVideo, videos, setVideos, paused, setPaused, videoEvents, setVideoEvents } = useContext(MainContext);

  const onMouseDownCallback = () => setPaused(true);

  const onMouseMoveCallback = (newX, video) => {
    video.videoStart = getDurationOfPreviousVideos(video, videos) + (newX + dragPositionFixInPx) / 100;
  };
  const updateVideoEvents = () => {
    const notSortedEvents = [blackVideo, ...videos].map(v => VideoEvent.fromVideo(v));

    let sortedEvents = [];

    let needToResetVideos = false;

    for (let i = 0; i < notSortedEvents.length; i++) {
      const newEvents = notSortedEvents[i];

      if (!sortedEvents.length) {
        sortedEvents.push(newEvents.start, newEvents.end);
        continue;
      }

      const lastEventTimeStamp = sortedEvents[sortedEvents.length - 1].timeStamp;

      if (newEvents.start.timeStamp === lastEventTimeStamp) {
        sortedEvents.push(newEvents.start, newEvents.end);
        continue;
      }

      if (newEvents.start.timeStamp > lastEventTimeStamp) {
        // const blackTime = newEvents.start.timeStamp - lastEventTimeStamp;

        // const blackVideo = new BlackVideoModel(blackTime);
        // // BlackVideoModel.videoStart =
        // const blackVideoEvents = VideoEvent.fromVideo(blackVideo);

        // // set the black video as pre-last one
        // videos[videos.length] = videos[videos.length - 1];
        // videos[videos.length - 2] = blackVideo;

        // sortedEvents.push(blackVideoEvents.start, blackVideoEvents.end, newEvents.start, newEvents.end);

        // needToResetVideos = true;

        continue;
      }

      // remove all events which pair is overlapped by the new pair of events
      // i.e removed all events where
      // e => e.pairStartEvent.timeStamp >= newEvents.start.timeStamp && e.pairEndEvent.timeStamp <= newEvents.end.timeStamp
      sortedEvents = sortedEvents.filter(
        e => e.pairStartEvent.timeStamp < newEvents.start.timeStamp || e.pairEndEvent.timeStamp > newEvents.end.timeStamp
      );

      for (let j = 0; j < sortedEvents.length; j++) {
        const sortedEvent = sortedEvents[j];

        // if new event pair starts and ends between the sorted pair,
        // then slice sorted pair into two and insert new pair between
        if (
          sortedEvent.pairStartEvent.timeStamp <= newEvents.start.timeStamp &&
          sortedEvent.pairEndEvent.timeStamp >= newEvents.end.timeStamp &&
          //and to prevent endless loop of j = 0
          sortedEvent.pairStartEvent !== newEvents.start
        ) {
          sortedEvents = sortedEvents.filter(e => e !== sortedEvent && e !== sortedEvent.pairEvent);

          const newEventsFromOrdered = [];

          if (sortedEvent.pairStartEvent.timeStamp < newEvents.start.timeStamp) {
            const newEventsBefore = VideoEvent.fromVideo(sortedEvent.video, { videoEnd: newEvents.start.timeStamp });
            newEventsFromOrdered.push(newEventsBefore.start, newEventsBefore.end);
          }

          newEventsFromOrdered.push(newEvents.start, newEvents.end);

          if (sortedEvent.pairEndEvent.timeStamp > newEvents.end.timeStamp) {
            const newEventsAfter = VideoEvent.fromVideo(sortedEvent.video, { videoStart: newEvents.end.timeStamp });
            newEventsFromOrdered.push(newEventsAfter.start, newEventsAfter.end);
          }

          // console.log(`pre-last: pushed event pair ${newEvents.start.timeStamp}-${newEvents.end.timeStamp}`)
          sortedEvents.push(...newEventsFromOrdered);

          VideoEvent.sortEvents(sortedEvents);

          // just for sure because we messed with the collection that is being iterated;
          j = 0;

          continue;
        }

        // if new event pair starts between the sorted pair,
        // then truncate end of sorted pair by the start of the new pair
        if (
          sortedEvent.pairStartEvent.timeStamp < newEvents.start.timeStamp &&
          sortedEvent.pairEndEvent.timeStamp > newEvents.start.timeStamp
        ) {
          sortedEvent.pairEndEvent.timeStamp = newEvents.start.timeStamp;
        }

        // if new event pair ends between the sorted pair,
        // then truncate start of sorted pair by the end of the new pair
        if (
          sortedEvent.pairStartEvent.timeStamp < newEvents.end.timeStamp &&
          sortedEvent.pairEndEvent.timeStamp > newEvents.end.timeStamp
        ) {
          sortedEvent.pairStartEvent.timeStamp = newEvents.end.timeStamp;
        }
      }

      // prevent double adding of the events which were added in the scope with j = 0
      if (!sortedEvents.some(e => e === newEvents.start && e.pairEvent === newEvents.end)) {
        // console.log(`last: pushed event pair ${newEvents.start.timeStamp}-${newEvents.end.timeStamp}`)
        sortedEvents.push(newEvents.start, newEvents.end);
      }

      VideoEvent.sortEvents(sortedEvents);
    }

    if (needToResetVideos) {
      setVideos(videos);
    }

    blackVideo.duration = sortedEvents.reduce((reducer, event) => (event.timeStamp > reducer ? event.timeStamp : reducer), 0);

    setVideoEvents(sortedEvents);

    // console.log(sortedEvents.map(e => e.timeStamp));
  };

  const onMouseUpCallback = updateVideoEvents;

  // this fix is required because the ribbons are basically a flexed row of relative div elements;
  // it doesn't depend on the position of the previous video ribbons
  const previousVideosRibbonWidth = videoModel.previousVideosDuration * 100;
  const xPositionRequiredFixInPx = dragPositionFixInPx - previousVideosRibbonWidth;

  console.log(xPositionRequiredFixInPx);

  const [dragRef, x, isDragging] = useHorizontalDragging(
    videoModel,
    xPositionRequiredFixInPx,
    onMouseDownCallback,
    onMouseMoveCallback,
    onMouseUpCallback
  );

  const isFirstRenderRef = useRef(true);

  const left = !isFirstRenderRef.current || isDragging ? x : 0;

  isFirstRenderRef.current = false;

  return (
    <div
      ref={dragRef}
      style={{
        position: "relative",
        left: left,
        border: `1px solid ${isDragging ? "blue" : "gray"}`,
        backgroundColor: "#141e2b"
      }}
      className={styles["one-video-frame-ribbon"]}
    >
      {videoModel.thumbnails.map((t, i, a) => (
        <FrameThumbnail key={`${videoModel.objectUrl}-thumbnail-${i}`} imgSrc={t} width={getFrameThumbnailWidth(i, a, videoModel)} />
      ))}
    </div>
  );
};

const getFrameThumbnailWidth = (frameIndex, allFrames, videoModel) => {
  const isLastInArray = frameIndex === allFrames.length - 1;

  if (!isLastInArray) {
    return 25;
  }

  const frameDuration = 0.25;

  // get length of the last frame, between 0 and 0.25 seconds
  const lastFrameDuration = videoModel.duration % frameDuration;

  // we can do that because frame lasts for 0.25 seconds and its default width is 25 px
  // so 0.25s has 25 px width and, for example, 0.142s should have 14.2px of width
  return (lastFrameDuration || frameDuration) * 100;
};

export default DraggableVideoFrameRibbon;

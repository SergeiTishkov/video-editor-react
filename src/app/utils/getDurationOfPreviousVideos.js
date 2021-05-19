import VideoModel from "app/dataModels/VideoModel";

/**
 * Gets duration of previous videos
 * @param {number | VideoModel} video index of the video or the video itself
 * @param {*} allVideos all dropped down videos
 */
export const getDurationOfPreviousVideos = (video, allVideos) => {
  if (!allVideos instanceof Array) {
    throw new Error(`getDurationOfPreviousVideos: param 'allVideos' is not number an array; allVideos is '${allVideos}'`);
  }

  const videoIndex = typeof video === "object" ? allVideos.findIndex(v => v === video) : typeof video === "number" ? video : null;

  if (!videoIndex || videoIndex < 0) {
    throw new Error(`getDurationOfPreviousVideos: param 'video' is not number or not an object in allVideos array; video is '${video}'`);
  }

  const prevVideosDuration = allVideos.slice(0, videoIndex - 1).reduce((reducer, video) => reducer + video.duration, 0);

  return prevVideosDuration;
};

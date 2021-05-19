import { MutableRefObject } from "react";

/**
 * Contains all the data required for one Video render
 */
export default class VideoModel {
  blob: Blob;
  objectUrl: string;
  thumbnails: string[];
  duration: number;
  height: number;
  width: number;

  // below are props that are dynamically added / changed / deleted as the video is used in the app;
  // basically this class is a view bag if Video that contains everything needed for video rendering
  /**
   * React ref to the <video> that renders this video
   */
  ref?: MutableRefObject<undefined>;

  /**
   * Distance between left brim of the draggable <div> and the pixel where mouse click happened during drag event start
   */
  dragClickX?: number;

  /**
   * total duration of all the videos that are before this one in the video player queue
   */
  previousVideosDuration?: number;

  /**
   * Constructor of VideoModel
   * @param blob Blob that contains the video
   * @param objectUrl URL that is prepared by window object and can be used in src
   * @param thumbnails Stringified thumbnails of each 0.25 seconds of the video, can be used in src
   * @param duration Duration of the video
   * @param height Height of the video
   * @param width Width of the video
   */
  constructor(blob: Blob, objectUrl: string, thumbnails: string[], duration: number, height: number, width: number) {
    this.blob = blob;
    this.objectUrl = objectUrl;
    this.thumbnails = thumbnails;
    this.duration = duration;
    this.height = height;
    this.width = width;
  }
}

import { MutableRefObject } from "react";
import { IVideoDuration } from "./abstractions/IVideoDuration";

let idCounter: number = 1;

/**
 * Contains all the data required for one Video render
 */
export default class VideoModel implements IVideoDuration {
  id: string;

  get isBlackVideo(): boolean {
    return false;
  }

  /** React ref to the <video> that renders this video */
  ref?: MutableRefObject<undefined>;

  /** Distance between left brim of the draggable <div> and the pixel where mouse click happened during drag event start */
  dragClickX?: number;

  /** Total duration of all the videos that are before this one in the video player queue */
  previousVideosDuration?: number;

  /** Number of seconds from the beginning of the global video player to this video start */
  videoStart?: number;

  /** Number of seconds from the beginning of the global video player to this video end */
  get videoEnd(): number | undefined {
    return (this.videoStart ?? 0) + this.duration;
  }

  /**
   * Constructor of VideoModel
   * @param blob Blob that contains the video  content and type
   * @param objectUrl URL that is prepared by window object and can be used in video HTML tag src attribute
   * @param thumbnails Stringified src thumbnails of each 0.25 seconds of the video, can be used in src
   * @param duration Duration of the video
   * @param height Height of the video
   * @param width Width of the video
   */
  constructor(
    public blob: Blob,
    public objectUrl: string,
    public thumbnails: string[],
    public duration: number,
    public height: number,
    public width: number
  ) {
    this.id = `video-${idCounter++}`;
  }
}

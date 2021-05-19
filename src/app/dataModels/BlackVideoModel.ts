import blackFrameSrc from "assets/images/black-frame-thumbnail.png";

/**
 * Contains all the data required to render blank black video placeholder.
 */
export default class BlackVideoModel {
  get thumbnails(): string[] {
    let framesAmount = Math.floor(this.duration * 4);

    // i.e. duration has not full 0.25 second frame on the end.
    if (this.duration % 0.25) {
      framesAmount++;
    }

    return new Array(framesAmount).fill(blackFrameSrc);
  }

  duration: number;

  height: number = 200;
  width: number = 300;

  // below are props that are dynamically added / changed / deleted as the video is used in the app;
  // basically this class is a view bag if Video that contains everything needed for video rendering
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
   * Constructor of BlackVideoModel
   * @param duration Duration of the video placeholder
   */
  constructor(duration: number) {
    this.duration = duration;
  }
}

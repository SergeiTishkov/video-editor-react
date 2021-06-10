import blackFrameSrc from "assets/images/black-frame-thumbnail.png";
import { IVideoDuration } from "./abstractions/IVideoDuration";

let idCounter: number = 1;

/**
 * Contains all the data required to render blank black video placeholder.
 */
export class BlackVideoModel implements IVideoDuration {
  id: string;

  get isBlackVideo(): boolean {
    return true;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(value) {
    if (value === this._duration && value !== 0) {
      return;
    }

    this._duration = value;

    let framesAmount = Math.floor(this._duration * 4);

    // i.e. duration has not full 0.25 second frame on the end.
    if (this._duration % 0.25) {
      framesAmount++;
    }

    this.thumbnails = new Array(framesAmount).fill(blackFrameSrc);
  }

  thumbnails?: string[];

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
  constructor(private _duration: number, public height: number = 200, public width: number = 300) {
    this.duration = _duration;

    this.id = `black-video-${idCounter++}`
  }
}

import { VideoEventType } from "app/enums/VideoEventType";
import VideoModel from "./VideoModel";

export class VideoEvent {
  /**Query for the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/ */
  get mediaFragment(): string {
    return `#t=${this.mediaFragmentStart ?? 0},${this.mediaFragmentEnd ?? this.video.duration}`;
  }

  /**
   * Constructor of VideoEvent
   * @param id Unique Identifier of the event
   * @param startTimeStamp time from the global beginning of video to the start of this event
   * @param type type of the event
   * @param videoIndex index of the video of this event
   * @param video Video Model object that contains all the data required for the video to render
   * @param mediaFragmentStart Start of the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/
   * @param mediaFragmentEnd End of the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/
   */
  constructor(
    public id: number,
    public startTimeStamp: number,
    public type: VideoEventType,
    public videoIndex: number,
    public video: VideoModel,
    public mediaFragmentStart?: number,
    public mediaFragmentEnd?: number
  ) {}
}

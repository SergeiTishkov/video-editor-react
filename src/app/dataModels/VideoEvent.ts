import { VideoEventType } from "app/enums/VideoEventType";
import { BlackVideoModel } from "./BlackVideoModel";
import VideoModel from "./VideoModel";

export class VideoEvent {
  /**
   * Creates a pair of VideoEvents from VideoModel
   * @param video VideoModel base of the resulting 2 events
   * @param params videoStart: optional custom video start timestamp, pass undefined if you don't need to customize it from default value;
   * videoEnd: optional; custom video end timestamp, pass undefined if you don't need to customize it from default value
   * @returns
   */
  static fromVideo(
    video: VideoModel | BlackVideoModel,
    params?: { videoStart?: number; videoEnd?: number }
  ): { start: VideoEvent; end: VideoEvent } {
    const events = {
      start: new VideoEvent(params?.videoStart ?? video.videoStart ?? 0, VideoEventType.Start, video),
      end: new VideoEvent(params?.videoEnd ?? video.videoEnd ?? 0, VideoEventType.End, video)
    };

    VideoEvent.setPairEvents(events.start, events.end);

    return events;
  }

  static setPairEvents(one: VideoEvent, other: VideoEvent) {
    if (one.type === other.type) {
      throw new Error(
        `Attempt to set pair events of the same type. Event is ${JSON.stringify(one)}; other event is ${JSON.stringify(other)}`
      );
    }

    if (one.video !== other.video) {
      throw new Error(
        `Attempt to set pair events of different videos. Event is ${JSON.stringify(one)}; other event is ${JSON.stringify(other)}`
      );
    }

    one._pairEvent = other;
    other._pairEvent = one;
  }

  static sortEvents(events: VideoEvent[]): void {
    events.sort((a, b) => {
      if (a.timeStamp === b.timeStamp) {
        return a.isStartEvent ? 1 : -1;
      }

      return a.timeStamp - b.timeStamp;
    });
  }

  /**true if this event is overlapped by some another event */
  overlapped: boolean = false;

  /**Query for the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/ */
  get mediaFragment(): string {
    return `#t=${this.mediaFragmentStart ?? 0},${this.mediaFragmentEnd ?? this.video.duration}`;
  }

  private _pairEvent?: VideoEvent;

  get pairEvent(): VideoEvent | undefined {
    return this._pairEvent;
  }

  get pairStartEvent(): VideoEvent | undefined {
    return this.getPairEventOfType(VideoEventType.Start);
  }

  get pairEndEvent(): VideoEvent | undefined {
    return this.getPairEventOfType(VideoEventType.End);
  }

  get isStartEvent() {
    return this.type === VideoEventType.Start;
  }

  get isEndEvent() {
    return this.type === VideoEventType.End;
  }

  /**
   * Constructor of VideoEvent
   * @param timeStamp time from the global beginning of video to this event
   * @param type type of the event
   * @param video Video Model object that contains all the data required for the video to render
   * @param mediaFragmentStart Start of the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/
   * @param mediaFragmentEnd End of the fragment of media that should play for this event, see https://www.w3.org/TR/media-frags/
   */
  constructor(
    public timeStamp: number,
    public type: VideoEventType,
    public video: VideoModel | BlackVideoModel,
    public mediaFragmentStart?: number,
    public mediaFragmentEnd?: number
  ) {}

  private getPairEventOfType(type: VideoEventType): VideoEvent | undefined {
    if (this.type === type) {
      return this;
    } else {
      return this._pairEvent;
    }
  }
}

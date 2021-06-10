export interface IVideoDuration {
  id: string;
  /** Duration of the video */
  duration: number;
  /** Number of seconds from the beginning of the global video player to this video start */
  videoStart?: number;
  /** Number of seconds from the beginning of the global video player to this video end */
  videoEnd: number | undefined;
  /**true if it's black video, false if it's real video */
  isBlackVideo: boolean
}
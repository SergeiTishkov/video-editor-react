export default class VideoModel {
  /**Prepared Blob from arrayBuffer and type */
  blob?: Blob;

  /**URL that is prepared by window object and can be used in src */
  objectUrl?: string;

  /**Stringified thumbnails of each 0.25 seconds of the video, can be used in src */
  thumbnails?: string[];
}
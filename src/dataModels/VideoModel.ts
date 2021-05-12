export default class VideoModel {
  /**Video in byte format */
  arrayBuffer?: ArrayBuffer;

  /**Media type of the video */
  type?: string;

  /**Prepared Blob from arrayBuffer and type */
  blob?: Blob;

  /**URL that is prepared by window object and can be used in src */
  objectUrl?: string;

  /**Stringified thumbnails of each 0.25 seconds of the video, can be used in src */
  thumbnails?: string[];
}
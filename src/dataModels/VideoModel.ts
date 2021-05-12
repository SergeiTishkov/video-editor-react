export default class VideoModel {
  blob?: Blob;
  objectUrl?: string;
  thumbnails?: string[];

  /**
   * Constructor of VideoModel
   * @param blob Blob that contains the video 
   * @param objectUrl URL that is prepared by window object and can be used in src
   * @param thumbnails Stringified thumbnails of each 0.25 seconds of the video, can be used in src
   */
  constructor(blob: Blob, objectUrl: string, thumbnails: string[]) {
    this.blob = blob;
    this.objectUrl = objectUrl;
    this.thumbnails = thumbnails;
  }
}
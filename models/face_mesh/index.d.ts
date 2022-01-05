/**
 * @fileoverview Declarations for the face tracking API.
 */

/**
 * Represents pairs of (start,end) indexes so that we can connect landmarks
 * with lines to provide a skeleton when we draw the points.
 */
export declare type LandmarkConnectionArray = Array<[number, number]>;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_LIPS: LandmarkConnectionArray;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_LEFT_EYE: LandmarkConnectionArray;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_LEFT_EYEBROW: LandmarkConnectionArray;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_RIGHT_EYE: LandmarkConnectionArray;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_RIGHT_EYEBROW: LandmarkConnectionArray;

/**
 * Subgroup of FACEMESH_CONNECTIONS.
 */
export declare const FACEMESH_FACE_OVAL: LandmarkConnectionArray;

/**
 * onResults returns an array of landmarks. This array provides the combination
 * of contours listed above.
 */
export declare const FACEMESH_CONTOURS: LandmarkConnectionArray;

/**
 * onResults returns an array of landmarks. This array provides the edges of
 * the full set of landmarks.
 */
export declare const FACEMESH_TESSELATION: LandmarkConnectionArray;

/**
 * Represents a read-only vector.
 */
export declare interface ReadOnlySimpleVector<T> {
  get(index: number): T;
  size(): number;
}

/**
 * Represents a normalized rectangle. Has an ID that should be consistent
 * across calls.
 */
export declare interface NormalizedRect {
  xCenter: number;
  yCenter: number;
  height: number;
  width: number;
  rotation: number;
  rectId: number;
}

/**
 * Represents a single normalized landmark.
 */
export declare interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/**
 * We support several ways to get image inputs.
 */
export type InputImage = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

/**
 * Legal inputs.
 */
export interface InputMap {
  image: InputImage;
}

/**
 * GpuBuffers should all be compatible with Canvas' `drawImage`
 */
type GpuBuffer = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

/**
 * One list of landmarks.
 */
export type NormalizedLandmarkList = NormalizedLandmark[];

/**
 * Multiple lists of landmarks.
 */
export type NormalizedLandmarkListList = NormalizedLandmarkList[];

/**
 * Possible results from FaceMesh.
 */
export interface Results {
  multiFaceLandmarks: NormalizedLandmarkListList;
  image: GpuBuffer;
}

/**
 * Configurable options for FaceMesh.
 */
export interface Options {
  selfieMode?: boolean;
  maxNumFaces?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

/**
 * Listener for any results from FaceMesh.
 */
export type ResultsListener = (results: Results) => (Promise<void>|void);

/**
 * Contains all of the setup options to drive the face solution.
 */
export interface FaceMeshConfig {
  locateFile?: (path: string, prefix?: string) => string;
}

/**
 * Declares the interface of FaceMesh.
 */
declare interface FaceMeshInterface {
  close(): Promise<void>;
  onResults(listener: ResultsListener): void;
  initialize(): Promise<void>;
  reset(): void;
  send(inputs: InputMap): Promise<void>;
  setOptions(options: Options): void;
}

/**
 * Encapsulates the entire FaceMesh solution. All that is needed from the
 * developer is the source of the image data. The user will call `send`
 * repeatedly and if a face is detected, then the user can receive callbacks
 * with this metadata.
 */
export declare class FaceMesh implements FaceMeshInterface {
  constructor(config?: FaceMeshConfig);

  /**
   * Shuts down the object. Call before creating a new instance.
   */
  close(): Promise<void>;

  /**
   * Registers a single callback that will carry any results that occur
   * after calling Send().
   */
  onResults(listener: ResultsListener): void;

  /**
   * Initializes the solution. This includes loading ML models and mediapipe
   * configurations, as well as setting up potential listeners for metadata. If
   * `initialize` is not called manually, then it will be called the first time
   * the developer calls `send`.
   */
  initialize(): Promise<void>;

  /**
   * Tells the graph to restart before the next frame is sent.
   */
  reset(): void;

  /**
   * Processes a single frame of data, which depends on the options sent to the
   * constructor.
   */
  send(inputs: InputMap): Promise<void>;

  /**
   * Adjusts options in the solution. This may trigger a graph reload the next
   * time the graph tries to run.
   */
  setOptions(options: Options): void;
}

// import { ScatterGL } from "scatter-gl";
const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const IRIS_POINTS = "#FF2C35";
const NORMAL_POINTS = "#000";
const dot_size_number = "0.1"

let containerElement = document.querySelector("#scatter-gl-container");
const scatterGL = new ScatterGL(containerElement, {
  // camera: {zoom: 2.125},
  // orbitControls: {zoomSpeed: 1.125},
  'rotateOnStart': false,
  'selectEnabled': false,
  'styles': {'axesVisible' : false, 
            'point':{ "scaleDefault": dot_size_number, 
                      "scaleSelected": dot_size_number, 
                      "scaleHover": dot_size_number,
                    }
            }
});

export default function renderFace3d(predictions) {
  const pointsData = predictions.faceLandmarks.map((point) => [-point.x, -point.y, -point.z])
  let flattenedPointsData = [];
  flattenedPointsData = flattenedPointsData.concat(pointsData);

  const dataset = new ScatterGL.Dataset(flattenedPointsData);
  scatterGL.render(dataset);
  scatterGL.setPointColorer((i) => {
    if (i % (NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS * 2) > NUM_KEYPOINTS) {
      return IRIS_POINTS;
    }
    return NORMAL_POINTS;
  });
}

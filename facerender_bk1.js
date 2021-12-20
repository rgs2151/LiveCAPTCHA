// import { ScatterGL } from "scatter-gl";
const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const RED = "#FF2C35";
// const BLUE = "#157AB3";
const BLUE = "#000";

export default function renderFace3d(predictions) {
  const pointsData = predictions.map((prediction) => {
    let scaledMesh = prediction.scaledMesh;
    return scaledMesh.map((point) => [-point[0], -point[1], -point[2]]);
  });

  let flattenedPointsData = [];
  for (let i = 0; i < pointsData.length; i++) {
    flattenedPointsData = flattenedPointsData.concat(pointsData[i]);
  }
  const dataset = new ScatterGL.Dataset(flattenedPointsData);
  let containerElement = document.querySelector("#scatter-gl-container");
  const scatterGL = new ScatterGL(containerElement, {
    camera: {
      //zoom: 2.125
    },
    orbitControls: {
      // zoomSpeed: 1.125
    }
  });
  scatterGL.render(dataset);
  scatterGL.setPointColorer((i) => {
    if (i % (NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS * 2) > NUM_KEYPOINTS) {
      return RED;
    }
    return BLUE;
  });
}

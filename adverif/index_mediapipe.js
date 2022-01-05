// import face3d from "./facedata.js";
import renderFace3d from "./facerender.js";
import calcyaw from "./head_rotation.js";
import checkNumberOfFingers from "./finger_no.js"
import fingersOnLips from "./finger_on_lips.js"
import {shuffleDots,drawTheDots,connectTheDots} from "./connect_the_dots.js"
// import check_mouth_open from "./mouth_open.js"

const test = document.getElementById("test")
const videoElement = document.getElementsByClassName('input_video')[0];
const drawCanvasElement = document.getElementsByClassName('draw_canvas')[0];
const drawCanvasCtx = drawCanvasElement.getContext('2d');

var value = {faceLandmarks: undefined, rightHandLandmarks : undefined, image: ""}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handle_head_rotation(results){
  test.innerHTML = calcyaw(results.faceLandmarks[123],results.faceLandmarks[152])
}

function handle_num_fings(results){
  test.innerHTML = checkNumberOfFingers(results.rightHandLandmarks, numFingersChoice)
}

function handl_fings_on_lips(results){
  test.innerHTML = fingersOnLips(results)
}

function handl_connect_the_dots(results){
  drawTheDots(numPoints, drawCanvasCtx, drawCanvasElement)
  connectTheDots(results, drawCanvasElement, drawCanvasCtx)
}


// var choice = getRandomInt(1,2)
var choice = 2
var numFingersChoice = 4
var numPoints = 4
shuffleDots(numPoints, drawCanvasElement)

function mainController(results) {
  if (typeof results.faceLandmarks !== "undefined"){
    renderFace3d(results);
  }
  switch(choice) {
    case 0:
      handle_head_rotation(results)
      break;
    case 1:
      handle_num_fings(results)
      break;
    case 2:
      handl_fings_on_lips(results)
      break;
    case 3:
      handl_connect_the_dots(results)
      break;
  
    default:
      // code block
  }
}

function hand_onResults(results) {
  if(typeof results.multiHandLandmarks === 'undefined'){
    value.rightHandLandmarks = undefined;
  }else{
  value.rightHandLandmarks = results.multiHandLandmarks[0]
  }
}

function face_onResults(results) {
  if(typeof results.multiFaceLandmarks === 'undefined'){
    value.faceLandmarks = undefined
  }else{
  value.faceLandmarks = results.multiFaceLandmarks[0]
  value.image = results.image
  }
  mainController(value)
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(hand_onResults);

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(face_onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
    await hands.send({image: videoElement})
  },
  width: 600,
  height: 480
});
camera.start();

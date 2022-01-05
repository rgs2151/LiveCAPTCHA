// import face3d from "./facedata.js";
// import renderFace3d from "./adverif/facerender.js";
import calcyaw from "./adverif/head_rotation.js";
import checkNumberOfFingers from "./adverif/finger_no.js"
import fingersOnLips from "./adverif/finger_on_lips.js"
import {shuffleDots,drawTheDots,connectTheDots} from "./adverif/connect_the_dots.js"
// import check_mouth_open from "./mouth_open.js"

const test = document.getElementById("test")
const isntr = document.getElementById("instruction")
const videoElement = document.getElementById('video');
const drawCanvasElement = document.getElementsByClassName('draw_canvas')[0];
const drawCanvasCtx = drawCanvasElement.getContext('2d');

var value = {faceLandmarks: undefined, rightHandLandmarks : undefined, image: ""}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var head_handelled = 0
function handle_head_rotation(results, direction){
  // test.innerHTML = calcyaw(results.faceLandmarks[123],results.faceLandmarks[152], direction)
  if(typeof results.faceLandmarks === 'undefined'){
  }else{
    // var detected_dir = calcyaw(results.faceLandmarks[123],results.faceLandmarks[152], direction)
    // if(detected_dir == direction && head_handelled == 0){ head_handelled=1; console.log("submit"); $('#qw-form').submit();}

    var detected_dir = calcyaw(results.faceLandmarks[1],results.faceLandmarks[234],results.faceLandmarks[454], direction)
    if(detected_dir == direction && head_handelled == 0){ head_handelled=1; console.log("submit"); $('#qw-form').submit();}
  }
}

function handle_num_fings(results){
  checkNumberOfFingers(results.rightHandLandmarks, numFingersChoice)
}

function handl_fings_on_lips(results){
  fingersOnLips(results)
}

function handl_connect_the_dots(results){
  if (blockmin_flag == 1){
    drawTheDots(numPoints, drawCanvasCtx, drawCanvasElement)
  }
  connectTheDots(results, drawCanvasElement, drawCanvasCtx)
}


// var choice = getRandomInt(1,4)
var choice = 1
var numFingersChoice = getRandomInt(1,4)
var numPoints = 4
var instruction_text = ""
var inst_flag = 0

shuffleDots(numPoints, drawCanvasElement)

function mainController(results) {
  if (typeof results.faceLandmarks !== "undefined"){
    // renderFace3d(results);
  }
  switch(choice) {
    case 0:
      if(inst_flag == 0){instruction_text = "Please look to the right"}
      handle_head_rotation(results, "right")
      break;
    case 1:
      if(inst_flag == 0){instruction_text = "Please show "+ numFingersChoice + " fingers"}
      handle_num_fings(results)
      break;
    case 2:
      if(inst_flag == 0){instruction_text = "Place your index finger on your lips"}
      handl_fings_on_lips(results)
      break;
    case 3:
      if(inst_flag == 0){instruction_text = "Please connect all the dots"}
      handl_connect_the_dots(results)
      break;
    case 4:
      if(inst_flag == 0){instruction_text = "Please look to the left"}
      handle_head_rotation(results, "left")
      break;
    default:
      // code block
  }
  if (blockmin_flag == 1){
    if (inst_flag == 0){ inst_flag = 1; isntr.innerHTML = instruction_text}
  }
}

var hand_model_loaded_flag = 0
function hand_onResults(results) {
  if (hand_model_loaded_flag == 0){hand_model_loaded_flag = 1}
  if(typeof results.multiHandLandmarks === 'undefined'){
    value.rightHandLandmarks = undefined;
  }else{
  value.rightHandLandmarks = results.multiHandLandmarks[0]
  }
}
var blockmin_flag = 0
var face_model_loaded_flag = 0
function face_onResults(results) {
  if (face_model_loaded_flag == 0){face_model_loaded_flag = 1;}
  if (blockmin_flag == 0 && face_model_loaded_flag== 1 && hand_model_loaded_flag == 1){blockmin_flag = 1; $('#block-area').unblock()}
  if(typeof results.multiFaceLandmarks === 'undefined'){
    value.faceLandmarks = undefined
  }else{
  value.faceLandmarks = results.multiFaceLandmarks[0]
  value.image = results.image
  }
  mainController(value)
}

const hands = new Hands({locateFile: (file) => {
  return `/models/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(hand_onResults);

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `/models/face_mesh/${file}`;
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
  width: 515,
  height: 400
});
camera.start();



//block ui --------------------------------------------------------------------------------------
//if all is good then this:
// $('#qw-form').submit();

$('#qw-form').on('submit', function(e) {

        $('#block-area').block({
            message: $('<div class="loader mx-auto loader-text-bg text-center">\n' +
                '                            <div class="line-scale-pulse-out">\n' +
                '                                <div class="bg-warning"></div>\n' +
                '                                <div class="bg-warning"></div>\n' +
                '                                <div class="bg-warning"></div>\n' +
                '                                <div class="bg-warning"></div>\n' +
                '                                <div class="bg-warning"></div>\n' +
                '                            </div>\n' +
                'Verifying Action....</div>')
        });

        return true;
    });
$( document ).ready(function() {

  $.blockUI.defaults = {
         timeout: 10000,
         fadeIn: 200,
         fadeOut: 400,
     };
  $('#block-area').block({
    message: $('<div class="loader mx-auto loader-text-bg text-center">\n' +
        '                            <div class="line-scale-pulse-out">\n' +
        '                                <div class="bg-warning"></div>\n' +
        '                                <div class="bg-warning"></div>\n' +
        '                                <div class="bg-warning"></div>\n' +
        '                                <div class="bg-warning"></div>\n' +
        '                                <div class="bg-warning"></div>\n' +
        '                            </div>\n' +
        'Initiating Advance Verification...</div>')
    });
  });
//block ui end --------------------------------------------------------------------------------------


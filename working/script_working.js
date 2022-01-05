console.log(azyo_capt_data)

// class MediaPipeClass{
//   constructor(){

//   }

  
// }

// class AzyoCaptcha {
//   constructor(id, trigger, holder, onsuccess) {
//       this.userID = id
//       this.trigger = trigger
//       this.holder = holder
//       this.onsuccess = onsuccess

//       set_modal(this.holder)

//       document.getElementById(this.trigger).addEventListener("click", function(){
//       this.checkID();
//       this.start_the_show();
//       });

//   }

//   checkID(){}

//   start_the_show(){
//       $('#CaptureModal').modal('show');
//       camera.start();
//   }

//   set_modal(holder){
//   }
// }


if (true){

  var holder = document.getElementById("azyo_holder")

  holder.innerHTML = `<div class="modal fade" id="CaptureModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
  <div class="modal-dialog modal-dialog-centered modal-xl" id="block-area2" style="box-shadow:none">
    <div class="modal-content" >
      <div class="modal-body">
          <div class="container bg-white">
              <div class="row">
                <div class="col-12">
                  <div class="card-body">
                    <h4 class="font-weight-bold text-center">AZYO’s Facial Recognition
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeModal">
                      <span aria-hidden="true">&times;</span>
                    </button></h4>
                    <hr>
                    <div id="vid" class="justify-content-center d-flex m-0 p-0 vh-75 vw-75" >
                      <p id = "loading" style="text-align: center;position: absolute;z-index: 1000; margin-top: 220px; font-weight: 900px;font-size: 18px; color: ghostwhite;background-color: rgba(92, 88, 88, 0.61); border-radius: 5px; padding: 2px;">
                        Scanning your Face...           
                      </p>
                      <p id = "inst" style="text-align: center;position: absolute;z-index: 900; margin-top: 20px; font-weight: 900px;font-size: 18px; color: ghostwhite;background-color: rgba(92, 88, 88, 0.61); border-radius: 5px; padding: 2px;"></p>
                      <canvas class="draw_canvas" width="680px" height="425px" style="position: absolute; z-index: 900;"></canvas>
                      <canvas class="output_canvas" width="680px" height="425px" style="display: none; position: absolute; z-index: 500;"></canvas>
                      <div style="position: relative;">
                        <canvas class="face_canvas" width="100px" height="100px" style="position: absolute; z-index: 990;display: none;bottom: 6px;right: 0;outline: 2px solid white;"></canvas>
                        <canvas class="mesh_canvas" width="100px" height="100px" style="position: absolute; z-index: 995;display: none;bottom: 6px;right: 0;"></canvas>
                        <div id = "mesh_err_box" style="height:100px; width: 100px; position: absolute; z-index: 996;display: block;bottom: 6px;right: 0;">
                          <p id = "mesh_err" style="text-align: center;position: relative;z-index: 997; margin-top: 35px; font-weight: 900px;font-size: 18px; color: ghostwhite;background-color: rgba(92, 88, 88, 0.61); border-radius: 5px; padding: 2px;display: none;"></p>
                        </div>
                        <video id="video" width="680px" height="425px" autoplay muted style="outline: 2px solid black; outline-offset: 6px;" ></video>
                        <img id = "normal" src="images/Hi_inst.png" height="100" width="100" style="display: none;position:absolute;top: 0;right: 0;z-index:1000;outline: 2px solid white;">
                        <img id = "dots" src="images/dots.gif" height="100" width="100" style="display: none;position:absolute;top:0;right:0;z-index:1000;outline: 2px solid white;">
                        <img id = "lips" src="images/lips.gif" height="100" width="100" style="display: none;position:absolute;top:0;right:0;z-index:1000;outline: 2px solid white;">
                        <img id = "fingers" src="images/fingers.gif" height="100" width="100" style="display: none;position:absolute;top:0;right:0;z-index:1000;outline: 2px solid white;">
                      </div>
                    </div>
                    <br>
                    <div class="text-center">
                      <h6>Please ensure that your face is visible at all times</h6>
                      <button id="capture" class="btn btn-hover-shine btn-warning w-50" >Register Your Face</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
  </div>`



  // getting video element and capture button
  const video = document.getElementById('video')
  const cap = document.getElementById('capture')
  const loading = document.getElementById('loading')
  const inst = document.getElementById('inst')
  const mesh_err = document.getElementById('mesh_err')
  const canvasElement = document.getElementsByClassName('output_canvas')[0];
  const meshCanvasElement = document.getElementsByClassName('mesh_canvas')[0];
  const drawCanvasElement = document.getElementsByClassName('draw_canvas')[0];
  const faceCanvasElement = document.getElementsByClassName('face_canvas')[0];
  const meshCtx = meshCanvasElement.getContext('2d')
  const faceCtx = faceCanvasElement.getContext('2d')
  const canvasCtx = canvasElement.getContext('2d');
  const drawCanvasCtx = drawCanvasElement.getContext('2d');

  faceCtx.translate(faceCanvasElement.width, 0);
  faceCtx.scale(-1, 1);

  meshCtx.translate(meshCanvasElement.width, 0);
  meshCtx.scale(-1, 1);

  canvasCtx.lineWidth = 2
  drawCanvasElement.style.display = "none"
  drawCanvasCtx.lineWidth = 2
  var dotShuffleFlag = 1
  var dots = []
  var dotSize = 17
  var dotIndex = -1
  faceCtx.font = '20px sans-serif';


  cap.style.display = "none"


  function taskCompleteFlag(tasknum){
    if(tasknum == 0){
      listDone[0] = "task_1"
    }else if (tasknum == 1){
      listDone[1] = "task_2"
    }
  }

  function drawUserInstr(current_task){
    // console.log("cameHere")
    if (current_task == "fingersOnLips"){
      inst.innerHTML = "Please place your index finger on your lips"
      lips_element.style.display = "block"
    }else if (current_task == "checkNumberOfFingers"){
      inst.innerHTML = "Please raise and hold "+numFingersChoice+" fingers of your right hand. <br>Finger(s) shown: "+current_finger
      fingers_element.style.display = "block"
    }else if (current_task == "connectTheDots"){
      inst.innerHTML = "Please connect the dots using your right hand"
      dots_element.style.display = "block"
      drawCanvasElement.style.display = "block"
      drawTheDots()
    }
  }

  function clickableRegister(){
    loading.style.display = "none"
    normal_pic.style.display = "none"
    faceCanvasElement.style.display = "block"
    meshCanvasElement.style.display = "block"
  }

  var LandmarkToggle = true

  function drawLandmarksOnVideo(results) {
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (LandmarkToggle){
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
                      {color: '#C0C0C070', lineWidth: 1});
      canvasCtx.restore();
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function checkDistance(oldx, oldy, selx, sely, dist){
    const dx = oldx - selx
    const dy = oldy - sely
    const distance_between = Math.hypot(dx, dy)
    return distance_between > dist
  }

  var allowed_shuffle_dist = 150
  function shuffleDots_off(numPoints){
    dots = []
    dots.push([getRandomInt(canvasElement.width*0.1,canvasElement.width*0.3),getRandomInt(canvasElement.height*0.3,canvasElement.height*0.7)])
    for(let i=1;i<numPoints;i++){
      while(true){
        var heightch = getRandomInt(canvasElement.height*0.3,canvasElement.height*0.7)
        var widthch = getRandomInt(canvasElement.width*0.1,canvasElement.width*0.3)
        // console.log(dots.length)
        console.log(heightch)
        // console.log(dots[1])
        // console.log(Math.hypot(dots[0][0] - heightch, dots[0][1] - widthch) > allowed_shuffle_dist)

        // console.log(dots.every((element) => Math.hypot(element[0] - heightch, element[1] - widthch) > allowed_shuffle_dist ))

        if (dots.every((element) => Math.hypot(element[0] - heightch, element[1] - widthch) > allowed_shuffle_dist )){
          dots.push([widthch,heightch])
          break;
        }
      }
    }
    dots.push(dots[0])
  }

  function shuffleDots(numPoints){
    dots = []

    var minibox_padding_margin = 0.3

    // var minxbound = canvasElement.width*0.1
    // var maxxbound = canvasElement.width*0.4
    // var minybound = canvasElement.height*0.3
    // var maxybound = canvasElement.height*0.7

    var minxbound = canvasElement.width*0.6
    var maxxbound = canvasElement.width*0.9
    var minybound = canvasElement.height*0.3
    var maxybound = canvasElement.height*0.7

    var no_of_col = 2

    var xbound_incriment = (maxxbound - minxbound)/no_of_col
    var ybound_incriment = (maxybound - minybound)/2

    var xmargin = xbound_incriment*minibox_padding_margin
    var ymargin = ybound_incriment*minibox_padding_margin

    for (let i = 0; i < numPoints; i++) {
      // var X = ((i % (numPoints/2)) * xbound_incriment_1) + minxbound;
      var X = ((i % (2)) * xbound_incriment) + minxbound;
      var Y = (Math.floor(i / 2) * ybound_incriment)+minybound;
      
      var minibox_min_x = X + xmargin
      var minibox_max_x = X + xbound_incriment - xmargin
      var minibox_min_y = Y + ymargin
      var minibox_max_y = Y + ybound_incriment - ymargin
      
      var x_dot_in_minibox = getRandomInt(minibox_min_x,minibox_max_x)
      var y_dot_in_minibox = getRandomInt(minibox_min_y,minibox_max_y)

      dots.push([x_dot_in_minibox,y_dot_in_minibox])

      // view the box size and shape distributions
      // canvasCtx.fillStyle='#'+Math.floor(Math.random()*16777215).toString(16);
      // canvasCtx.fillRect(X, Y, xbound_incriment, ybound_incriment);
    }
    dots.push(dots[0])
    console.log(dots)
  }
  // drawCanvasCtx.translate(faceCanvasElement.width, 0);
  // drawCanvasCtx.scale(-1, 1);
  function drawTheDots(){
    
    drawCanvasCtx.clearRect(0, 0, drawCanvasElement.width, drawCanvasElement.height)
    
    for(let i = 0; i<dots.length; i++){
        drawCanvasCtx.beginPath();

        drawCanvasCtx.arc(dots[i][0],dots[i][1],dotSize,0,2*Math.PI);
        if(i%numPoints == (dotIndex+1)%numPoints){
            drawCanvasCtx.fillStyle = "red";
        }
        else{
            drawCanvasCtx.fillStyle = "black";
        }
        drawCanvasCtx.fill();
        
        drawCanvasCtx.font = '8pt Calibri';
        drawCanvasCtx.fillStyle = 'white';
        drawCanvasCtx.textAlign = 'center';
        drawCanvasCtx.fillText((i%numPoints)+1, dots[i][0], dots[i][1]+3);

        drawCanvasCtx.stroke();
    }
    if (dotIndex != -1){
      for(let i=0; i<dotIndex;i++){
        drawCanvasCtx.beginPath();
        drawCanvasCtx.moveTo(dots[i][0],dots[i][1])
        drawCanvasCtx.lineTo(dots[i+1][0], dots[i+1][1]);
        drawCanvasCtx.stroke();
        drawCanvasCtx.closePath();
      }
    }
  }

  function connectTheDots(x, y, tasknum){
    // drawUserInstr("connectTheDots")
    const chosenx = canvasElement.width - parseInt(x*canvasElement.width)
    const choseny = parseInt(y*canvasElement.height)

    if (dotIndex != -1){

        drawCanvasCtx.beginPath();
        drawCanvasCtx.moveTo(dots[dotIndex][0],dots[dotIndex][1])
        drawCanvasCtx.lineTo(chosenx, choseny);
        drawCanvasCtx.stroke();
        drawCanvasCtx.closePath();
    }

    if (dotIndex+1 < dots.length){
        const dx = chosenx - dots[dotIndex+1][0]
        const dy = choseny - dots[dotIndex+1][1]
        const dist_to_dot = Math.hypot(dx, dy)
        
        if (dist_to_dot < dotSize){
            dotIndex+=1
        }
    }else{
        // dotShuffleFlag = 1
        // dotIndex = -1
        drawCanvasCtx.clearRect(0, 0, drawCanvasElement.width, drawCanvasElement.height)
        // console.log("alldone")
        taskCompleteFlag(tasknum)
    }
    // console.log(dots)
  }
  var current_finger = 0
  var fing_buffer = []
  var tip_keys = [8, 12, 16, 20]
  var mid_keys = [6, 10, 14, 18]

  function checkNumberOfFingers(hands, tasknum) {
    // console.log(hands)
    if(typeof hands === 'undefined'){
      current_finger = 0;
      return current_finger
    }else{
      var open_fingers = []
      for (let i = 0; i<tip_keys.length; i++){
          if (hands[tip_keys[i]].y < hands[mid_keys[i]].y){
              // Finger is open
              open_fingers.push(tip_keys[i])
          }
      }

      if (fing_buffer.length < 10){
        fing_buffer.push(open_fingers.length)
      }
      else {
        fing_buffer.every( (val, i, arr) => val === arr[0] )
        
        // console.log(open_fingers.length)
        if(numFingersChoice == fing_buffer[0] && fing_buffer.every( (val, i, arr) => val === arr[0] )){
          taskCompleteFlag(tasknum)
        }
        fing_buffer.shift()
        fing_buffer.push(open_fingers.length)
        current_finger = open_fingers.length
        return current_finger
    }
    }
  }

  // mouth between 61 on left and 291 right
  var lipcheck_buffer = 0
  function fingersOnLips(results, tasknum) {
    if(typeof value.rightHandLandmarks === 'undefined' || typeof value.faceLandmarks === 'undefined'){
    }else{
      // drawUserInstr("fingersOnLips")
      var xlips1 = results.faceLandmarks[61].x
      var ylips1 = results.faceLandmarks[61].y
      var xlips2 = results.faceLandmarks[291].x
      // var ylips2 = results.faceLandmarks[291].y
    
      var xindextip = results.rightHandLandmarks[8].x
      var yindextip = results.rightHandLandmarks[8].y
      var xindexend = results.rightHandLandmarks[6].x
      var yindexend = results.rightHandLandmarks[6].y
    
      // console.log("xlips1", xlips1,"xindextip", xindextip)
    
      if (xlips1 < xindextip && xindextip < xlips2 && xlips1 < xindexend && xindexend <  xlips2){
          // console.log("InbetweenX");
          if (yindextip < ylips1 && ylips1 < yindexend){
            // console.log("Both Set")
            // taskCompleteFlag(tasknum)

            if (lipcheck_buffer <= 10){
              lipcheck_buffer++
            }else{
              taskCompleteFlag(tasknum)
            }
          }
      } else {
        lipcheck_buffer = 0
      }
      // if (xlips1 < xindextip && xindextip < xlips2 ){
      //   // console.log("InbetweenX")
      //   taskCompleteFlag(tasknum)
      // }
    }

  }
  var left_pad = 40
  var top_pad = 50
  var zoom = 10
  var FacetextString = "No Face"
  var textWidth = faceCtx.measureText(FacetextString).width;
  mesh_err.innerHTML = FacetextString

  function drawFace(results){
    if(faceCanvasElement.style.display !== "block"){
      faceCanvasElement.style.display = "block"
      meshCanvasElement.start.disabled = "block"
    }
    // console.log(canvasElement)
    if(typeof results.faceLandmarks === 'undefined'){
      // face is not there
      meshCtx.clearRect(0, 0, 100, 100);
      faceCtx.fillStyle = 'black';
      faceCtx.fillRect(0,0, 100, 100);

      if (mesh_err.style.display != "block"){
        mesh_err.style.display = "block"
      }
      
      // faceCtx.fillStyle = "white";
      // faceCtx.fillText(FacetextString , (faceCanvasElement.width/2) - (textWidth / 2), 60);
    }else{
      if (mesh_err.style.display == "block"){
        mesh_err.style.display = "none"
      }
      var sx = results.faceLandmarks[234].x * canvasElement.width - left_pad
      var sy = results.faceLandmarks[10].y * canvasElement.height - top_pad
      var sh = results.faceLandmarks[152].y * canvasElement.height - sy + zoom
      // var sw = results.faceLandmarks[454].x - sx
      var sw = results.faceLandmarks[152].y * canvasElement.height - sy + zoom
      faceCtx.clearRect(0, 0, 100, 100);
      meshCtx.clearRect(0, 0, 100, 100);
      // console.log(sx,sy,sh,sw)
      faceCtx.drawImage(results.image,
        sx, sy, sw, sh,
        0, 0, 100, 100
      );
      meshCtx.drawImage(canvasElement,
        sx, sy, sw, sh,
        0, 0, 100, 100
      );
      // drawConnectors(faceCtx, results.faceLandmarks, FACEMESH_TESSELATION,
      //   {color: '#C0C0C070', lineWidth: 1});
    }
    // faceCtx.drawImage(results.image,
    //   0, 0, 100, 100,
    //   sx, sy, sw, sh,
    // );
    // console.log(results.image)
    
    // faceCtx.beginPath();
    // faceCtx.rect(0,0, 50, 50);
    // faceCtx.stroke();
  }


  var listDone = ["undefined", "undefined"]
  // var choice = getRandomInt(0,2)
  var choice = 1
  var numFingersChoice = getRandomInt(2,4)
  // var numPoints = getRandomInt(4,5)
  var numPoints = 4
  var currTask = 0
  // console.log(dots)
  // fingersOnLips = 0
  // checkNumberOfFingers = 1
  // connectTheDots = 2

  if (dotShuffleFlag){
    // var numPoints = num
    dotShuffleFlag = 0
    shuffleDots(numPoints)
  }

  var identity_array = [
    [
      "fingersOnLips",
      "checkNumberOfFingers",
    ],
    [
      "fingersOnLips",
      "connectTheDots",
    ],
    [
      "checkNumberOfFingers",
      "connectTheDots",
    ]
  ]

  //select a set of tasks to do
  //draw user instructions as per selection 
  //execute tasks if only they are selected
  //check if the selections are completely executed and auto-submit

  const dots_element = document.getElementById("dots")
  const lips_element = document.getElementById("lips")
  const fingers_element = document.getElementById("fingers")
  const normal_pic = document.getElementById("normal")


  var showInst = 1
  var first_time = 1
  var pause_all = 0
  var pause_text = ""
  // var pause_text = "Great! Now, for the next task..."
  // var stop_text = "Authenticity confirmed"

  function mainController(results) {
    // console.log(identity_array[choice][currTask])
    // console.log(listDone)
    if (pause_all){
      // drawCanvasElement.style.display = "none"
      inst.style.display = "none"
      dots_element.style.display = "none"
      lips_element.style.display = "none"
      fingers_element.style.display = "none"
      loading.innerHTML = pause_text
      loading.style.display = "block"
      normal_pic.style.display = "none"
      faceCanvasElement.style.display = "none"
      meshCanvasElement.style.display = "none"
      return
    }
    
    clickableRegister()
    drawLandmarksOnVideo(results)
    drawFace(results)
    if (showInst){
      inst.style.display = "block"
      // drawCanvasElement.style.display = "block"
      drawUserInstr(identity_array[choice][currTask])
    }
    
    var array_of_tasks = [
      [
        function() { fingersOnLips(results, 0) },
        function() { checkNumberOfFingers(results.rightHandLandmarks, 1) },
      ],
      [
        function() { fingersOnLips(results, 0) },
        function() { connectTheDots(results.rightHandLandmarks[8].x, results.rightHandLandmarks[8].y,1) },
      ],
      [
        function() { checkNumberOfFingers(results.rightHandLandmarks,0) },
        function() { connectTheDots(results.rightHandLandmarks[8].x, results.rightHandLandmarks[8].y,1) },
      ]
    ]

    if(typeof results.rightHandLandmarks === 'undefined'){
    }else{

      if(listDone[1] == "task_2"){
        drawCanvasElement.style.display = "none"
        // captureImg()
        // console.log("now call the register button")
        // showInst = 0
        // inst.style.display = "none"
        pause_text = "Authentication confirmed"
        showInst = 0
        pause_all = 1
        // setTimeout(()=> pause_all = 0,5000)
      }
      else if(listDone[0] == "task_1"){
        if (first_time){
          first_time = 0
          pause_text = "Great! let's do one more thing..."
          pause_all = 1
          setTimeout(()=> pause_all = 0,3000)
        }
        currTask = 1
        // drawUserInstr(identity_array[choice][1])
        array_of_tasks[choice][1]()
      }
      else {
        // drawUserInstr(identity_array[choice][0])
        currTask = 0
        array_of_tasks[choice][0]()
      }

      // Some sort of flag system but how to prevent multiple parallel executions
      // Maybe a return statement system but what about multiple returns cuz async
      // For loop system totally broken
    }
  }

  var value = {faceLandmarks: "", rightHandLandmarks : "", image: ""}

  function hand_onResults(results) {
    //do work hand
    // console.log("Hands:")
    // console.log(results)
    if(typeof results.multiHandLandmarks === 'undefined'){
      value.rightHandLandmarks = undefined;
    }else{
    value.rightHandLandmarks = results.multiHandLandmarks[0]
    }
  }

  function face_onResults(results) {
    //do work face
    // console.log("face:")
    // console.log(results)
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

  const camera = new Camera(video, {
    onFrame: async () => {
    // await holistic.send({image: video});
    await hands.send({image: video});
    await faceMesh.send({image: video});
    },
    // facingMode: { exact: "environment" },
    width: 680,
    height: 425,
  });

  document.getElementById("clicker").addEventListener("click", function(){
    $('#CaptureModal').modal('show');
    camera.start();
  });

  // //handling modals
  // $('#CaptureModal').on('shown.bs.modal', function () {
  //   // onstart=0;
  //   // startVideo()
  // //   document.getElementsByClassName('cursor')[0].style.display = "none";
  // //   document.getElementsByClassName('cursor')[1].style.display = "none";
  //   camera.start();
  // });

}
else {

}

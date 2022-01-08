class AzyoCaptcha{

  constructor(id, trigger, holder, onfinish){
    this.init_imports()
    this.validated = false
    $.ajax({
      type: "POST",
      enctype: 'JSON',
      url: 'http://192.168.0.105:5003/secret_code_check',
      headers: { 'Access-Control-Allow-Origin': 'http://192.168.0.106:5003/log' },
      data: JSON.stringify({'secret': id, 'domain': window.location.hostname}),
      processData: false,
      'contentType': 'application/json',
      cache: false,
      success: res => {
        if (res['ERROR']) {
            console.warn('API KEY INVALID', res)
        } else {
          this.value = {faceLandmarks: "", rightHandLandmarks : "", image: ""}
      
          this.setup_divs(holder);
          this.set_class_vars();
          
          this.hands = new Hands({locateFile: (file) => {
            return `/models/hands/${file}`;
          }});
          this.hands.setOptions({
            maxNumHands: 2,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          this.hands.onResults((results)=> {
            //do work hand
            if(typeof results.multiHandLandmarks === 'undefined'){
              this.value.rightHandLandmarks = undefined;
            }else{
              this.value.rightHandLandmarks = results.multiHandLandmarks[0]
            }
          });
      
          this.faceMesh = new FaceMesh({locateFile: (file) => {
            return `/models/face_mesh/${file}`;
          }});
      
          this.faceMesh.setOptions({
            maxNumFaces: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          this.faceMesh.onResults((results) => {
            //do work face
            if(typeof results.multiFaceLandmarks === 'undefined'){
              this.value.faceLandmarks = undefined
            }else{
            this.value.faceLandmarks = results.multiFaceLandmarks[0]
            this.value.image = results.image
            }
            this.mainController(this.value, onfinish, id)
          });
      
          document.getElementById(trigger).addEventListener("click", () => {
            // this.checkID();
            this.start_the_show();
          });
      
          if (this.dotShuffleFlag){
            // var numPoints = num
            this.dotShuffleFlag = 0
            this.shuffleDots(this.numPoints)
          }
          
        }
        console.log("azyo captcha initiated")
      },
      error: error => console.error('ERROR SENDING FORM: ', error)
    });

  }

  init_imports(){
    $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">');
    $('head').append('<link rel= "stylesheet" href="styles.css">');
    $('head').append('<script defer src="ext/blockui.min.js" ></script>');
    $('head').append('<script src="utils/camera_utils.js"></script>');
    $('head').append('<script src="utils/drawing_utils.js"></script>');
    $('head').append('<script src="models/face_mesh/face_mesh.js"></script>');
    $('head').append('<script src="models/hands/hands.js"></script>');
    // $('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');
    $('head').append('<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>');
    $('head').append('<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>');
  }
  
  start_the_show(){
    $('#CaptureModal').modal('show');

    this.camera = new Camera(this.video, {
      onFrame: async () => {
      // await holistic.send({image: video});
      await this.hands.send({image: this.video});
      await this.faceMesh.send({image: this.video});
      },
      // facingMode: { exact: "environment" },
      width: 680,
      height: 425,
    });

    this.camera.start();
  }



  setup_divs(hol){
    // var holder = document.getElementById("azyo_holder")
    var holder = document.getElementById(hol)

    holder.innerHTML = `<div class="modal fade" id="CaptureModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
    <div class="modal-dialog modal-dialog-centered modal-xl" id="block-area2" style="box-shadow:none">
      <div class="modal-content" >
        <div class="modal-body" style = "padding:0px">
            <div class="container bg-white">
                <div class="row">
                  <div class="col-12">
                    <div class="card-body">
                      <h4 class="font-weight-bold text-center">
                      <img src="images/azyo shield logo.png" width = "27px" style = "margin-bottom: 5px;">
                      AZYO SHIELD
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
                        <h10 style = "opacity:0.3;">powered by azyo</h10>
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
  }
  
  set_class_vars(){
    this.video = document.getElementById('video')
    this.cap = document.getElementById('capture')
    this.loading = document.getElementById('loading')
    this.inst = document.getElementById('inst')
    this.mesh_err = document.getElementById('mesh_err')
    this.canvasElement = document.getElementsByClassName('output_canvas')[0];
    this.meshCanvasElement = document.getElementsByClassName('mesh_canvas')[0];
    this.drawCanvasElement = document.getElementsByClassName('draw_canvas')[0];
    this.faceCanvasElement = document.getElementsByClassName('face_canvas')[0];
    
    this.meshCtx = this.meshCanvasElement.getContext('2d')
    this.faceCtx = this.faceCanvasElement.getContext('2d')
    this.canvasCtx = this.canvasElement.getContext('2d');
    this.drawCanvasCtx = this.drawCanvasElement.getContext('2d');
    
    this.faceCtx.translate(this.faceCanvasElement.width, 0);
    this.faceCtx.scale(-1, 1);
    this.meshCtx.translate(this.meshCanvasElement.width, 0);
    this.meshCtx.scale(-1, 1);

    this.canvasCtx.lineWidth = 2
    this.drawCanvasElement.style.display = "none"
    this.drawCanvasCtx.lineWidth = 2
    this.dotShuffleFlag = 1
    this.dots = []
    this.dotSize = 17
    this.dotIndex = -1
    this.faceCtx.font = '20px sans-serif';

    this.cap.style.display = "none"
    this.LandmarkToggle = true

    this.current_finger = 0
    this.fing_buffer = []
    this.tip_keys = [8, 12, 16, 20]
    this.mid_keys = [6, 10, 14, 18]

    this.lipcheck_buffer = 0

    this.left_pad = 40
    this.top_pad = 50
    this.zoom = 10
    this.FacetextString = "No Face"
    this.textWidth = this.faceCtx.measureText(this.FacetextString).width;
    this.mesh_err.innerHTML = this.FacetextString

    this.listDone = ["undefined", "undefined"]
    this.choice = this.getRandomInt(1,2)
    // this.choice = 1
    this.numFingersChoice = this.getRandomInt(2,4)
    // this.numPoints = getRandomInt(4,5)
    this.numPoints = 4
    this.currTask = 0
    // console.log(dots)
    // fingersOnLips = 0
    // checkNumberOfFingers = 1
    // connectTheDots = 2

    this.identity_array = [
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

    this.dots_element = document.getElementById("dots")
    this.lips_element = document.getElementById("lips")
    this.fingers_element = document.getElementById("fingers")
    this.normal_pic = document.getElementById("normal")

    this.showInst = 1
    this.first_time = 1
    this.pause_all = 0
    this.pause_text = ""
    // this.pause_text = "Great! Now, for the next task..."
    // this.stop_text = "Authenticity confirmed"

  }

  taskCompleteFlag(tasknum){
    if(tasknum == 0){
      this.listDone[0] = "task_1"
    }else if (tasknum == 1){
      this.listDone[1] = "task_2"
    }
  }

  drawUserInstr(current_task){
    // console.log("cameHere")
    if (current_task == "fingersOnLips"){
      this.inst.innerHTML = "Please place your index finger on your lips"
      this.lips_element.style.display = "block"
    }else if (current_task == "checkNumberOfFingers"){
      this.inst.innerHTML = "Please raise and hold "+ this.numFingersChoice+" fingers of your right hand. <br>Finger(s) shown: "+ this.current_finger
      this.fingers_element.style.display = "block"
    }else if (current_task == "connectTheDots"){
      this.inst.innerHTML = "Please connect the dots using your right hand"
      this.dots_element.style.display = "block"
      this.drawCanvasElement.style.display = "block"
      this.drawTheDots()
    }
  }

  clickableRegister(){
    this.loading.style.display = "none"
    this.normal_pic.style.display = "none"
    this.faceCanvasElement.style.display = "block"
    this.meshCanvasElement.style.display = "block"
  }

  drawLandmarksOnVideo(results) {
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (this.LandmarkToggle){
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
                      {color: '#C0C0C070', lineWidth: 1});
      this.canvasCtx.restore();
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  checkDistance(oldx, oldy, selx, sely, dist){
    const dx = oldx - selx
    const dy = oldy - sely
    const distance_between = Math.hypot(dx, dy)
    return distance_between > dist
  }

  shuffleDots(numPoints){
    this.dots = []

    var minibox_padding_margin = 0.3

    var minxbound = this.canvasElement.width*0.6
    var maxxbound = this.canvasElement.width*0.9
    var minybound = this.canvasElement.height*0.3
    var maxybound = this.canvasElement.height*0.7

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
      
      var x_dot_in_minibox = this.getRandomInt(minibox_min_x,minibox_max_x)
      var y_dot_in_minibox = this.getRandomInt(minibox_min_y,minibox_max_y)

      this.dots.push([x_dot_in_minibox,y_dot_in_minibox])

      // view the box size and shape distributions
      // canvasCtx.fillStyle='#'+Math.floor(Math.random()*16777215).toString(16);
      // canvasCtx.fillRect(X, Y, xbound_incriment, ybound_incriment);
    }
    this.dots.push(this.dots[0])
    // console.log("internal dot", this.dots)
    // console.log("global dot", this.dots)
  }
  
  drawTheDots(){
    
    this.drawCanvasCtx.clearRect(0, 0, this.drawCanvasElement.width, this.drawCanvasElement.height)
    
    for(let i = 0; i<this.dots.length; i++){
      this.drawCanvasCtx.beginPath();

        this.drawCanvasCtx.arc(this.dots[i][0],this.dots[i][1],this.dotSize,0,2*Math.PI);
        if(i%this.numPoints == (this.dotIndex+1)%this.numPoints){
            this.drawCanvasCtx.fillStyle = "red";
        }
        else{
            this.drawCanvasCtx.fillStyle = "black";
        }
        this.drawCanvasCtx.fill();
        
        this.drawCanvasCtx.font = '8pt Calibri';
        this.drawCanvasCtx.fillStyle = 'white';
        this.drawCanvasCtx.textAlign = 'center';
        this.drawCanvasCtx.fillText((i%this.numPoints)+1, this.dots[i][0], this.dots[i][1]+3);

        this.drawCanvasCtx.stroke();
    }
    if (this.dotIndex != -1){
      for(let i=0; i<this.dotIndex;i++){
        this.drawCanvasCtx.beginPath();
        this.drawCanvasCtx.moveTo(this.dots[i][0],this.dots[i][1])
        this.drawCanvasCtx.lineTo(this.dots[i+1][0], this.dots[i+1][1]);
        this.drawCanvasCtx.stroke();
        this.drawCanvasCtx.closePath();
      }
    }
  }

  connectTheDots(x, y, tasknum){
    // drawUserInstr("connectTheDots")
    const chosenx = this.canvasElement.width - parseInt(x*this.canvasElement.width)
    const choseny = parseInt(y*this.canvasElement.height)

    if (this.dotIndex != -1){
        this.drawCanvasCtx.beginPath();
        this.drawCanvasCtx.moveTo(this.dots[this.dotIndex][0],this.dots[this.dotIndex][1])
        this.drawCanvasCtx.lineTo(chosenx, choseny);
        this.drawCanvasCtx.stroke();
        this.drawCanvasCtx.closePath();
    }

    if (this.dotIndex+1 < this.dots.length){
        const dx = chosenx - this.dots[this.dotIndex+1][0]
        const dy = choseny - this.dots[this.dotIndex+1][1]
        const dist_to_dot = Math.hypot(dx, dy)
        
        if (dist_to_dot < this.dotSize){
          this.dotIndex+=1
        }
    }else{
        this.drawCanvasCtx.clearRect(0, 0, this.drawCanvasElement.width, this.drawCanvasElement.height)
        this.taskCompleteFlag(tasknum)
    }
    // console.log(dots)
  }
  
  checkNumberOfFingers(hands, tasknum) {
    // console.log(hands)
    if(typeof hands === 'undefined'){
      this.current_finger = 0;
      return this.current_finger
    }else{
      var open_fingers = []
      for (let i = 0; i<this.tip_keys.length; i++){
          if (hands[this.tip_keys[i]].y < hands[this.mid_keys[i]].y){
              // Finger is open
              open_fingers.push(this.tip_keys[i])
          }
      }

      if (this.fing_buffer.length < 10){
        this.fing_buffer.push(open_fingers.length)
      }
      else {
        this.fing_buffer.every( (val, i, arr) => val === arr[0] )
        
        // console.log(open_fingers.length)
        if(this.numFingersChoice == this.fing_buffer[0] && this.fing_buffer.every( (val, i, arr) => val === arr[0] )){
          this.taskCompleteFlag(tasknum)
        }
        this.fing_buffer.shift()
        this.fing_buffer.push(open_fingers.length)
        this.current_finger = open_fingers.length
        return this.current_finger
      }
    }
  }

  fingersOnLips(results, tasknum) {
    // mouth between 61 on left and 291 right
    if(typeof results.rightHandLandmarks === 'undefined' || typeof results.faceLandmarks === 'undefined'){}
    else{
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

            if (this.lipcheck_buffer <= 10){
              this.lipcheck_buffer++
            }else{
              this.taskCompleteFlag(tasknum)
            }
          }
      } else {
        this.lipcheck_buffer = 0
      }
      // if (xlips1 < xindextip && xindextip < xlips2 ){
      //   // console.log("InbetweenX")
      //   taskCompleteFlag(tasknum)
      // }
    }

  }

  drawFace(results){
    if(this.faceCanvasElement.style.display !== "block"){
      this.faceCanvasElement.style.display = "block"
      this.meshCanvasElement.start.disabled = "block"
    }
    // console.log(canvasElement)
    if(typeof results.faceLandmarks === 'undefined'){
      // face is not there
      this.meshCtx.clearRect(0, 0, 100, 100);
      this.faceCtx.fillStyle = 'black';
      this.faceCtx.fillRect(0,0, 100, 100);

      if (this.mesh_err.style.display != "block"){
        this.mesh_err.style.display = "block"
      }
      
    }else{
      if (this.mesh_err.style.display == "block"){
        this.mesh_err.style.display = "none"
      }
      var sx = results.faceLandmarks[234].x * this.canvasElement.width - this.left_pad
      var sy = results.faceLandmarks[10].y * this.canvasElement.height - this.top_pad
      var sh = results.faceLandmarks[152].y * this.canvasElement.height - sy + this.zoom
      // var sw = results.faceLandmarks[454].x - sx
      var sw = results.faceLandmarks[152].y * this.canvasElement.height - sy + this.zoom
      this.faceCtx.clearRect(0, 0, 100, 100);
      this.meshCtx.clearRect(0, 0, 100, 100);
      // console.log(sx,sy,sh,sw)
      this.faceCtx.drawImage(results.image,
        sx, sy, sw, sh,
        0, 0, 100, 100
      );
      this.meshCtx.drawImage(this.canvasElement,
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

  increment_succ(id, onfinish){
    $.ajax({
      type: "POST",
      enctype: 'JSON',
      url: "http://192.168.0.105:5003//success_count",
      headers: { 'Access-Control-Allow-Origin': 'http://192.168.0.106:5003/log' },
      data: JSON.stringify({'secret': id, 'domain': window.location.hostname}),
      processData: false,
      'contentType': 'application/json',
      cache: false,
      success: data => {if (data["ERROR"]) {onfinish("failed");} else {onfinish("success")}} ,
      error: error => {console.error('ERROR SENDING FORM: ', error); onfinish("failed")}
    });
  }

  mainController(results, onfinish, id) {
    if (this.pause_all){
      // drawCanvasElement.style.display = "none"
      this.inst.style.display = "none"
      this.dots_element.style.display = "none"
      this.lips_element.style.display = "none"
      this.fingers_element.style.display = "none"
      this.loading.innerHTML = this.pause_text
      this.loading.style.display = "block"
      this.normal_pic.style.display = "none"
      this.faceCanvasElement.style.display = "none"
      this.meshCanvasElement.style.display = "none"
      return
    }
    
    this.clickableRegister()
    this.drawLandmarksOnVideo(results)
    this.drawFace(results)
    if (this.showInst){
      this.inst.style.display = "block"
      // drawCanvasElement.style.display = "block"
      this.drawUserInstr(this.identity_array[this.choice][this.currTask])
    }
    
    var array_of_tasks = [
      [
        ()=> { this.fingersOnLips(results, 0) },
        ()=> { this.checkNumberOfFingers(results.rightHandLandmarks, 1) },
      ],
      [
        ()=> { this.fingersOnLips(results, 0) },
        ()=> { this.connectTheDots(results.rightHandLandmarks[8].x, results.rightHandLandmarks[8].y,1) },
      ],
      [
        ()=> { this.checkNumberOfFingers(results.rightHandLandmarks,0) },
        ()=> { this.connectTheDots(results.rightHandLandmarks[8].x, results.rightHandLandmarks[8].y,1) },
      ]
    ]

    if(typeof results.rightHandLandmarks === 'undefined'){
    }else{

      if(this.listDone[1] == "task_2"){
        this.drawCanvasElement.style.display = "none"
        // captureImg()
        // console.log("now call the register button")
        $('#CaptureModal').modal('hide');
        this.increment_succ(id, onfinish)
        
        // showInst = 0
        // inst.style.display = "none"
        this.pause_text = "Authentication confirmed"
        this.showInst = 0
        this.pause_all = 1
        // setTimeout(()=> pause_all = 0,5000)
      }
      else if(this.listDone[0] == "task_1"){
        if (this.first_time){
          this.first_time = 0
          this.pause_text = "Great! let's do one more thing..."
          this.pause_all = 1
          setTimeout(()=> this.pause_all = 0,3000)
        }
        this.currTask = 1
        // drawUserInstr(identity_array[choice][1])
        array_of_tasks[this.choice][1]()
      }
      else {
        // drawUserInstr(identity_array[choice][0])
        this.currTask = 0
        array_of_tasks[this.choice][0]()
      }

      // Some sort of flag system but how to prevent multiple parallel executions
      // Maybe a return statement system but what about multiple returns cuz async
      // For loop system totally broken
    }
  }

}
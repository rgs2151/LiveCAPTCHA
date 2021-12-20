var dots = []
var dotSize = 17
var dotIndex = -1
var i
var done = 0

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleDots(numPoints, drawCanvasElement){
    dots = []
    var minibox_padding_margin = 0.3

    var minxbound = drawCanvasElement.width*0.6
    var maxxbound = drawCanvasElement.width*0.9
    var minybound = drawCanvasElement.height*0.3
    var maxybound = drawCanvasElement.height*0.7

    var no_of_col = 2
  
    var xbound_incriment = (maxxbound - minxbound)/no_of_col
    var ybound_incriment = (maxybound - minybound)/2
  
    var xmargin = xbound_incriment*minibox_padding_margin
    var ymargin = ybound_incriment*minibox_padding_margin
  
    for (i = 0; i < numPoints; i++) {
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

function drawTheDots(numPoints, drawCanvasCtx, drawCanvasElement){

    drawCanvasCtx.clearRect(0, 0, drawCanvasElement.width, drawCanvasElement.height)

    for(i = 0; i<dots.length; i++){
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
        for(i=0; i<dotIndex;i++){
        drawCanvasCtx.beginPath();
        drawCanvasCtx.moveTo(dots[i][0],dots[i][1])
        drawCanvasCtx.lineTo(dots[i+1][0], dots[i+1][1]);
        drawCanvasCtx.stroke();
        drawCanvasCtx.closePath();
        }
    }
}

function connectTheDots(results, drawCanvasElement, drawCanvasCtx){
    // drawUserInstr("connectTheDots")

    if(typeof results.rightHandLandmarks === 'undefined'){
        return "bad_data"
    }else{
        var x = results.rightHandLandmarks[8].x
        var y = results.rightHandLandmarks[8].y
        const chosenx = drawCanvasElement.width - parseInt(x*drawCanvasElement.width)
        const choseny = parseInt(y*drawCanvasElement.height)
    
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
            // taskCompleteFlag(tasknum)
            // return "all connected"
            if (done == 0){
                done = 1;
                console.log("complete");
                $('#qw-form').submit();
            }
        }
        // console.log(dots)
        return "good_data";
    }
}

export {shuffleDots,drawTheDots,connectTheDots}
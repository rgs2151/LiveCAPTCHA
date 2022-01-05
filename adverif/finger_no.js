var current_finger = 0
var fing_buffer = []
var tip_keys = [8, 12, 16, 20]
var mid_keys = [6, 10, 14, 18]
var done = 0

export default function checkNumberOfFingers(hands, numFingersChoice) {
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
  
      if (fing_buffer.length < 30){
        fing_buffer.push(open_fingers.length)
        return "filling buffer"
      }
      else {
        // fing_buffer.every( (val, i, arr) => val === arr[0] )
        // console.log(fing_buffer)
        // console.log(open_fingers.length)
        if(numFingersChoice == fing_buffer[0] && fing_buffer.every( (val, i, arr) => val === arr[0] )){
          if(done == 0){
            done = 1
            console.log("complete")
            $('#qw-form').submit();
          }
        }
        fing_buffer.shift()
        fing_buffer.push(open_fingers.length)
        current_finger = open_fingers.length
        return current_finger
    }
    }
  }
  
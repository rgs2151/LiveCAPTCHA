var lipcheck_buffer = 0
var done = 0
export default function fingersOnLips(results) {
  if(typeof results.rightHandLandmarks === 'undefined' || typeof results.faceLandmarks === 'undefined'){
    return "bad data"
  }else{
    var xlips1 = results.faceLandmarks[61].x
    var ylips1 = results.faceLandmarks[61].y
    var xlips2 = results.faceLandmarks[291].x
    // var ylips2 = results.faceLandmarks[291].y
  
    var xindextip = results.rightHandLandmarks[8].x
    var yindextip = results.rightHandLandmarks[8].y
    var xindexend = results.rightHandLandmarks[6].x
    var yindexend = results.rightHandLandmarks[6].y
  
    // console.log("xlips1", xlips1,"xindextip", xindextip)
  
    if (xlips1 < xindextip && xindextip < xlips2 && xlips1 < xindexend && xindexend <  xlips2 && yindextip < ylips1 && ylips1 < yindexend){
      // console.log("Both Set")
      if (lipcheck_buffer <= 10){
        lipcheck_buffer++
        return "good data but buffer not filled"
      }else{
        // taskCompleteFlag(tasknum)
        // return "finger correct"
        if (done ==0){
          done = 1
          console.log("complete")
          $('#qw-form').submit();
        }
      }
    } else {
      lipcheck_buffer = 0
      return "good data but wrong place"
    }
  }

}
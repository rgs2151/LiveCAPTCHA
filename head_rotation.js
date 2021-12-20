//co-ordinates: left 123 right 152
// let headrotationangle = 2.7
let headrotationangle = 40
var head_buffer_right = 0
var head_buffer_left = 0

//left -40
//right 40

export default function calcyaw(nose, left_cheek, right_cheek, check){

    var nose_tip = [nose.x * 640, nose.y * 360, nose.z * 640]
    var mid = [(left_cheek.x + right_cheek.x) * 320, (left_cheek.y + right_cheek.y) * 180, (left_cheek.z + right_cheek.z) * 320]
    var h_ang = (nose_tip[0] - mid[0])/(nose_tip[2]-mid[2]) * 60
    var v_ang = (nose_tip[1] - mid[1])/(nose_tip[2]-mid[2]) * 60 + 15

    var yaw = Math.floor(h_ang)
    console.log(yaw)

    if(yaw >= 0){
        //condition when turning left
        if(yaw>=headrotationangle && check == "right"){
            if (head_buffer_left <= 10){
                head_buffer_left++
                return "good data but buffer not filled"
            }else{
                // return "left"
                // $('#qw-form').submit();
                return "right"
            }
        }else{
            head_buffer_left = 0
            return "neutral"
            // console.log("neutral or not the right emotion")
        }
    }else{
        if(yaw<=0){
            //condition when turning right
            if((-1*yaw)>=headrotationangle && check == "left"){
                if (head_buffer_right <= 10){
                    head_buffer_right++
                    return "good data but buffer not filled"
                }else{
                    // return "right"
                    // $('#qw-form').submit();
                    return "left"
                }
            }else{
                head_buffer_right = 0
                return "neutral"
                // console.log("neutral or not the right emotion")
            }
        }
    }
}


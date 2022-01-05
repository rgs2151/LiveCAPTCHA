// var mouth = results.multiFaceLandmarks[0].slice(48, 68)
// data.mouth = check_mouth_open(getupperlips(mouth),getlowerlips(mouth))

function getupperlips(mouth){
    var ulip = [];
    for(let i=1;i<=7;i++){
      ulip.push(mouth[i-1])
    }
    for(let i=17;i>=13;i--){
      ulip.push(mouth[i-1])
    }
    // console.log("upperlips is :" + ulip)
    return ulip
  }
  
function getlowerlips(mouth){
var blip = [];
for(let i=7;i<=12;i++){
    blip.push(mouth[i-1])
}
blip.push(mouth[0])
blip.push(mouth[12])
for(let i=20;i>=17;i--){
    blip.push(mouth[i-1])
}
// console.log("bottomlips is :" + blip)
return blip
}

function get_lip_height(lip){
    var sum = 0;
    for(let i=2;i<=4;i++){
        var distance = Math.sqrt(Math.pow((lip[i]["x"] - lip[12-i]["x"]), 2)+ Math.pow((lip[i]["y"] - lip[12-i]["y"]),2))
        console.log("distance is : " + distance)
        sum = sum + distance
    }
    console.log("lips height is :" + sum/3)
    return sum/3
}
  
function get_mouth_height(top_lip, bottom_lip){
    var sum = 0;
    for(let i=8;i<=10;i++){
        var distance = Math.sqrt(Math.pow((top_lip[i]["x"] - bottom_lip[18-i]["x"]),2) + Math.pow((top_lip[i]["y"] - bottom_lip[18-i]["y"]),2))
        sum = sum + distance
    }
    console.log("mouth height is :" + sum/3)
    return sum/3
}
  
export default function check_mouth_open(top_lip,bottom_lip){
    var top_lip_height = get_lip_height(top_lip);
    var bottom_lip_height = get_lip_height(bottom_lip);
    var mouth_height = get_mouth_height(top_lip, bottom_lip);

    ratio = 1;
    if(mouth_height > Math.min(top_lip_height, bottom_lip_height)*ratio){
        return true
    }else{
        return false
    }
}
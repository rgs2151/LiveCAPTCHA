import face3d from "./facedata.js";
import renderFace3d from "./facerender.js";

/*
 * Face renderer uses ScatterGL
 *
 */

let facedata = JSON.parse(face3d);
console.log(facedata[0].scaledMesh);
renderFace3d(facedata);

/*
 * Yet to add 13 point data
 * until then pls try to move iris around
   rightEyeIris: [473, 474, 475, 476, 477],
 */
//change the right iris x cordinates of all 5 points

console.log(facedata[0].scaledMesh[473].x);

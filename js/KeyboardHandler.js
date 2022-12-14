import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';


/**
 * This class provides to functionality to animate sprite sheets.
 */
export class KeyboardHandler {


    constructor(camera, scene) {  
        document.addEventListener("keydown", (e) => {onDocumentKeyDown(e, camera)}, false);
        document.addEventListener("keyup", (e) => {onDocumentKeyUp(e, camera)}, false);
    }

    onDocumentKeyDown(event, camera) {

        let xChange = 0;
        let zChange = 0;
    
        console.log(event.which)
        var keyCode = event.which;
        if (keyCode == 87) { // w
            forward = true;
        } else if (keyCode == 83) { // s
            backwards = true;
        } else if (keyCode == 65) { // a
            left = true;
        } else if (keyCode == 68) { // d
            right = true;
        } else if (keyCode == 32 && !tiltStarted) { //space
            tiltStarted = true;
    
            let yChange = 0.5 * tiltUp;
            //camera.rotation.y += 0.05;
            new TWEEN.Tween(camera.position)
            .to(
                {
                    y: camera.position.y + yChange
                },
                500
            )
            .start()
    
            tiltUp = -1 * tiltUp
    
        }
    };
    
    onDocumentKeyUp(event, camera) {
        console.log(event.which)
        var keyCode = event.which;
        if (keyCode == 87) { // w
            forward = false;
        } else if (keyCode == 83) { // s
            backwards = false;
        } else if (keyCode == 65) { // a
            left = false;
        } else if (keyCode == 68) { // d
            right = false;
        } else if (keyCode == 32 && tiltStarted) { //space
            tiltStarted = false;
        }
    }
}
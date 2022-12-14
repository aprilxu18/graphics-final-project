import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';


/**
 * This class provides to functionality to animate sprite sheets.
 */
export class KeyboardHandler {

    forward = false;
    backwards = false;
    right = false;
    left = false;

    tiltStarted = false;
    tiltUp = 1;

    loopOn = false;

    lastDir = "right";

    rotateStarted = false;

    sound;

    constructor(camera, sprite, sound, scene) {  

        this.sound = sound;

        function onDocumentKeyDown(event, camera, sprite, that) {

            if (that.rotateStarted) {
                return;
            }

            let xChange = 0;
            let zChange = 0;
            //console.log(sprite.getSprite())

            let spriteObjF = sprite.getSprite();
            //let spriteObjB = sprite.getSprite2();
        
            //console.log(event.which)
            var keyCode = event.which;
            if (keyCode == 87) { // w
                that.forward = true;
            } else if (keyCode == 83) { // s
                that.backwards = true;
            } else if (keyCode == 65) { // a
                that.left = true;
                if (that.lastDir === "right" && !that.rotateStarted) {
                    that.rotateStarted = true;
                    new TWEEN.Tween(spriteObjF.rotation)
                        .to({y: spriteObjF.rotation.y - THREE.MathUtils.degToRad(180)}, 300).start()
                        .onComplete(() => {that.rotateStarted = false;});
                    }
                that.lastDir = "left";
            } else if (keyCode == 68) { // d
                that.right = true;
                if (that.lastDir === "left") {
                    that.rotateStarted = true;
                    new TWEEN.Tween(spriteObjF.rotation)
                        .to({y: spriteObjF.rotation.y + THREE.MathUtils.degToRad(180)}, 300).start()
                        .onComplete(() => {that.rotateStarted = false;});
                    }
                that.lastDir = "right";
            } else if (keyCode == 32 && !that.tiltStarted) { //space
                that.tiltStarted = true;
        
                let yChange = 0.5 * that.tiltUp;
                //camera.rotation.y += 0.05;
                new TWEEN.Tween(camera.position)
                .to(
                    {
                        y: camera.position.y + yChange
                    },
                    500
                )
                .start()
        
                that.tiltUp = -1 * that.tiltUp
        
            }
        };
        
        function onDocumentKeyUp(event, camera, sprite, that) {
            //console.log(event.which)
            var keyCode = event.which;
            if (keyCode == 87) { // w
                that.forward = false;
            } else if (keyCode == 83) { // s
                that.backwards = false;
            } else if (keyCode == 65) { // a
                that.left = false;
            } else if (keyCode == 68) { // d
                that.right = false;
            } else if (keyCode == 32 && that.tiltStarted) { //space
                that.tiltStarted = false;
            }
        }

        var that = this
        document.addEventListener("keydown", (e) => {onDocumentKeyDown(e, camera, sprite, that)}, false);
        document.addEventListener("keyup", (e) => {onDocumentKeyUp(e, camera, sprite, that)}, false);
    }


    moveObject(spriteHandle, camera) {
        TWEEN.update();

        if (spriteHandle !== undefined) {
            let xChange = 0.005;
            let zChange = 0.005;

            let object = spriteHandle.getSprite();
            //let object2 = spriteHandle.getSprite2();

                if (!this.loopOn) {
                    spriteHandle.loop([0,1,2,3], 0.75);
                    this.loopOn = true;
                }
                if (this.forward) {
                    object.position.x -= xChange;
                    //object2.position.x -= xChange;
                    camera.position.x -= xChange;
                }
                if (this.backwards) {
                    object.position.x += xChange;
                    //object2.position.x += xChange;
                    camera.position.x += xChange;
                }
                if (this.right) {
                    object.position.z -= zChange;
                    //object2.position.z -= zChange;
                    camera.position.z -= zChange;
                }
                if (this.left) {
                    object.position.z += zChange;
                    //object2.position.z += zChange;
                    camera.position.z += zChange;
                }   
                if (!this.forward && !this.backwards && !this.left && !this.right) {
                    spriteHandle.loop([0], 1.5);
                    this.loopOn = false;
                    this.sound.pauseWalkingSound();
                } else {
                    this.sound.playWalkingSound();  
                }
            }
    }

}
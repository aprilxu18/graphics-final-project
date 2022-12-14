import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

/**
 * This class provides to functionality to animate sprite sheets.
 */
export class AudioHandler {

    ambientSound;
    walkSound;

    constructor(camera) {  
        var that = this;

        const listener = new THREE.AudioListener();
        camera.add(listener);
        this.ambientSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('../ambient.ogg', function( buffer ) {
            console.log("loading ambient audio")
            that.ambientSound.setBuffer( buffer );
            that.ambientSound.setLoop( true );
            that.ambientSound.setVolume( 0.1 );
            that.ambientSound.play();
        });

        const listener2 = new THREE.AudioListener();
        camera.add(listener2);
        this.walkSound = new THREE.Audio(listener2);
        const audioLoader2 = new THREE.AudioLoader();
        audioLoader2.load('../footsteps.wav', function(buffer) {
            console.log("loading walking audio")
            that.walkSound.setBuffer( buffer );
            that.walkSound.setLoop( true );
            that.walkSound.setVolume( 0.1 );
        });
    }

    playWalkingSound() {
        if (this.walkSound !== undefined && !this.walkSound.isPlaying) {
            this.walkSound.play();
        }
    }

    pauseWalkingSound() {
        if (this.walkSound !== undefined && this.walkSound.isPlaying) {
           this.walkSound.pause();
        }
    }
}
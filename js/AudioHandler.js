import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';


/**
 * This class provides to functionality to animate sprite sheets.
 */
export class AudioHandler {

    constructor(camera) {  
        const listener = new THREE.AudioListener();
        camera.add(listener);
        const sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('../ambient.ogg', function( buffer ) {
            console.log("loading audio")
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.2 );
            sound.play();
        });
    }
}
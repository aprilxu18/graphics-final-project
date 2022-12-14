//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/TrackballControls.js';
//import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

import * as THREE from 'three';
import { ShaderMaterial, Vector2, WebGLRenderTarget } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
//import { GammaCorrectionShader } from 'https://threejs.org/examples/js/shaders/GammaCorrectionShader.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'https://threejs.org/examples/jsm/postprocessing/BokehPass.js';
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js';
import { basicShader } from '../shaders/basicShader.js';
import { GammaCorrectionShader } from '../shaders/copyShader.js';
import { brightSpotsShader } from '../shaders/brightSpotsShader.js';
import { horizontalBlurShader } from '../shaders/horizontalBlurShader.js';
import { verticalBlurShader } from '../shaders/verticalBlurShader.js';
import { finalBloomShader } from '../shaders/finalBloomShader.js';

import { SpriteFlipbook } from './SpriteFlipBook.js';
import { ParticleShader } from './ParticleShader.js';
import { AudioHandler } from './AudioHandler.js';


// Load 3D Scene
var scene = new THREE.Scene(); 
var clock = new THREE.Clock();
	
 // Load a Renderer
var renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true});
//renderer.setClearColor( 0xC5C5C3 );
renderer.setClearColor( 0x000000 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Camera Perspective
 var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 20000 );
 camera.position.set( 1, 1, 20 );

const as = new AudioHandler(camera) 
	
// Load the Orbitcontroller
console.log(camera);
const controls = new OrbitControls(camera, renderer.domElement); 
controls.update();
			
 // Load Light
 var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
 scene.add( ambientLight );
 const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
 scene.add( directionalLight );

// glTf 2.0 Loader
var loader = new GLTFLoader();				
loader.load( '../media/scene.glb', function ( gltf ) {			
	gltf.scene.scale.set( 1 / 5, 1 / 5, 1 / 5 );			   
	gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	gltf.scene.position.z = 0;
    console.log(gltf)
    // camera = gltf.cameras[0];				    //Position (z = front +, back-)
	scene.add( gltf.scene );
});	 


// SOME MORE SPRITES
const knight = new SpriteFlipbook('js/sprite.png', 8, 8, scene);
knight.setPosition(1, 0.5, -5);
knight.loop([0,1,2,3], 1.5);

// Particles
const ps = new ParticleShader(scene);
THREE.ShaderLib.points.vertexShader = ps.getVert();
THREE.ShaderLib.points.fragmentShader = ps.getFrag();

renderer.gammaAttribute = 2.2;
// Passes:
const renderPass = new RenderPass(scene, camera);
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader, 'tDiffuse');
const brightnessPass = new ShaderPass(brightSpotsShader, 'tDiffuse');
const horizontalBlurPass = new ShaderPass(horizontalBlurShader, 'image');
const verticalBlurPass = new ShaderPass(verticalBlurShader, 'image');
const bokehPass = new BokehPass(scene, camera, {
    focus: 2.5,
    aperture: 0.005,
    maxblur: 0.01,
    width: window.innerWidth,
    height: window.innerHeight
  });

// Textures:
var originalSceneTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
var brightSpotsSceneTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
// originalSceneTexture.encoding = THREE.sRGBEncoding;
// brightSpotsSceneTexture.encoding = THREE.sRGBEncoding;

const finalBloomMaterial = new THREE.ShaderMaterial({
	vertexShader: finalBloomShader.vertexShader,
	fragmentShader: finalBloomShader.fragmentShader,
	uniforms: {
	  myTexture: {value: originalSceneTexture.texture},
	  bloom: {value: brightSpotsSceneTexture.texture}
	}
  });
const finalBloomPass = new ShaderPass(finalBloomMaterial);


// Composers:
const originalSceneComposer = new EffectComposer(renderer, originalSceneTexture);
originalSceneComposer.renderToScreen = false;
originalSceneComposer.addPass(renderPass); // RenderPass renders bufferScene containing the sphere
//originalSceneComposer.addPass(gammaCorrectionPass); // Renders texture onto originalSceneTexture

const brightSpotsComposer = new EffectComposer(renderer, brightSpotsSceneTexture);
brightSpotsComposer.renderToScreen = false;
brightSpotsComposer.addPass(renderPass); // Rerender the scene
brightSpotsComposer.addPass(brightnessPass); // Pick out the bright spots
brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur
brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur
//brightSpotsComposer.addPass(gammaCorrectionPass);
// brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
// brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur


const finalBloomComposer = new EffectComposer(renderer);
finalBloomComposer.renderToScreen = true;
finalBloomComposer.addPass(finalBloomPass);
//finalBloomComposer.addPass(bokehPass);



function animate(now) {

	//TWEEN.update();

	// const opacityArray = new Float32Array(particlesCnt)
	// for (let i = 0; i < particlesCnt; i++) {
	// 	opacityArray[i] = curAlphas[i].opacity;
	// }

	// particlesGeometry.setAttribute('alpha', new THREE.BufferAttribute(opacityArray, 1));


	render();
    controls.update();
	requestAnimationFrame( animate );

}

function render() {


	ps.particleAnimate();

	let deltaTime = clock.getDelta();
	knight.update(deltaTime)

	originalSceneComposer.swapBuffers();
	originalSceneComposer.render();
	
	// brightSpotsComposer.swapBuffers();
	// brightSpotsComposer.swapBuffers();
	brightSpotsComposer.render();

	finalBloomComposer.swapBuffers();
	finalBloomComposer.render();

	}

// renderer.physicallyCorrectLights = true
render();
animate();
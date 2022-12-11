import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';

// Load 3D Scene
var scene = new THREE.Scene(); 
	
 // Load a Renderer
var renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setClearColor( 0xC5C5C3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Camera Perspective
 var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 20000 );
 camera.position.set( 1, 1, 20 );
	
// Load the Orbitcontroller
console.log(camera);
const controls = new OrbitControls(camera, renderer.domElement); 
controls.update();
			
 // Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
scene.add( ambientLight );

			
// const light = new THREE.PointLight( 0xcccccc);
// light.position.set( 0, 10, 10 );
// scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// directionalLight.position.set(100, 100, 100);
// directionalLight.target.position.set(0, 0, 0);
scene.add( directionalLight );

 // glTf 2.0 Loader
var loader = new GLTFLoader();				
	loader.load( '../media/farm-house.glb', function ( gltf ) {			
	gltf.scene.scale.set( 1 / 5, 1 / 5, 1 / 5 );			   
	gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
        gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	gltf.scene.position.z = 0;
    console.log(gltf)
    // camera = gltf.cameras[0];				    //Position (z = front +, back-)
	scene.add( gltf.scene );
	});	 

function animate() {
	render();
    controls.update();
	requestAnimationFrame( animate );
	}

function render() {
	renderer.render( scene, camera );
	}

// renderer.physicallyCorrectLights = true
render();
animate();
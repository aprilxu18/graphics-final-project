import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/TrackballControls.js';
//import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

import { SpriteFlipbook } from './SpriteFlipBook.js';
import { ParticleShader } from './ParticleShader.js';
import { AudioHandler } from './AudioHandler.js';
import { ShaderComposer } from './ShaderComposer.js';
import { KeyboardHandler } from './KeyboardHandler.js';

let isDay = true;

// Load 3D Scene
var scene = new THREE.Scene();
var clock = new THREE.Clock();

// Load a Renderer
var renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
//renderer.setClearColor( 0xC5C5C3 );
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Camera Perspective
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(8, 1, 0);
camera.fov *= 0.5;
camera.updateProjectionMatrix();

const as = new AudioHandler(camera)

// Load the Orbitcontroller
console.log(camera);
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.update();

//Load Light
let color = 0xFFB367;
let intensity = .3;

if (isDay) {
	// console.log("HI")
	var ambientLight = new THREE.AmbientLight("0x404040", .5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight("0xffffff", 3);
	directionalLight.castShadow = true;
	directionalLight.position.set(50, 50, 0);
	directionalLight.shadow.bias = -0.0005;
	scene.add(directionalLight);
} else {
	var ambientLight = new THREE.AmbientLight("0x404040", .1);
	scene.add(ambientLight);

	const light1 = new THREE.PointLight(color, intensity);
	light1.position.set(1.3, .7, -.4);
	scene.add(light1);

	const light2 = new THREE.PointLight(color, intensity);
	light2.position.set(1.3, .7, .54);
	scene.add(light2);

	const light3 = new THREE.PointLight(color, intensity);
	light3.position.set(-.89, .2, .84);
	scene.add(light3);

	const light4 = new THREE.PointLight(color, intensity);
	light4.position.set(-.5, .2, 2.55);
	scene.add(light4);

	const light5 = new THREE.PointLight(color, intensity);
	light5.position.set(-.08, .2, -2.38);
	scene.add(light5);

	const light6 = new THREE.PointLight(color, intensity);
	light6.position.set(1.7, .2, -2.16);
	scene.add(light6);

	const light7 = new THREE.PointLight(color, intensity);
	light7.position.set(1.12, .2, -.98);
	scene.add(light7);

	const light8 = new THREE.PointLight(color, intensity);
	light8.position.set(.93, .35, 2.55);
	scene.add(light8);

	const light9 = new THREE.PointLight(color, intensity);
	light9.position.set(.72, .2, .925);
	scene.add(light9);

	const light10 = new THREE.PointLight(color, intensity);
	light10.position.set(-.55, .3, -.51);
	scene.add(light10);

	const light11 = new THREE.PointLight(color, intensity);
	light11.position.set(.13, .3, -1.35);
	scene.add(light11);
}

// glTf 2.0 Loader
var loader = new GLTFLoader();
loader.load('../media/scene.glb', function (gltf) {
	gltf.scene.scale.set(1 / 5, 1 / 5, 1 / 5);
	gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
	gltf.scene.position.y = 0;				    //Position (y = up+, down-)
	gltf.scene.position.z = 0;
	console.log(gltf)
	// camera = gltf.cameras[0];
	gltf.scene.traverse(function (child) {
		// console.log("HI")
		// console.log(child)
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
		if (!isDay) {
			if (child.name.includes("bottom")) {
				// console.log(child);
				child.traverse(function (c) {
					if (c.name.includes('_')) {
						let mat = new THREE.MeshStandardMaterial(color);
						mat.color.setHex(Number(color));
						mat.emissive.setHex(Number(color));
						mat.emissiveIntensity = 5;
						c.material = mat;
						// console.log(c.material)
					}
				})
			}
			if (child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles" ||
				child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles003") {
				let c = child.children[0].children[1];
				let mat = new THREE.MeshStandardMaterial(color);
				mat.color.setHex(Number(color));
				mat.emissive.setHex(Number(color));
				mat.emissiveIntensity = 5;
				c.material = mat;
			}
		}
		if (child.name === ("sky")) {
			if (isDay) {
				// child.material.color.setHex(0x84ECF4);
			} else {
				child.material.color.setHex(0x121549);
			}
		}

		if (child.name === ("ground")) {
			console.log(child.material)
			child.material.roughness = 10;
			if (isDay) {
				// child.material.color.setHex(0x35A92B);
			} else {
				child.material.color.setHex(0xE1EEFC);
			}
		}
	}
	)				    //Position (z = front +, back-)
	scene.add(gltf.scene);
});

// Particles
const ps = new ParticleShader(scene);
THREE.ShaderLib.points.vertexShader = ps.getVert();
THREE.ShaderLib.points.fragmentShader = ps.getFrag();

// SOME MORE SPRITES
const knight = new SpriteFlipbook('js/sprite1.png', 8, 1, scene);
knight.setPosition(1, 0.395, 0);

const ks = new KeyboardHandler(camera, knight, as, scene);
var composer = new ShaderComposer(renderer, scene, camera);

function animate(now) {

	TWEEN.update();
	ks.moveObject(knight, camera);

	render();
	//controls.update();
	requestAnimationFrame(animate);

}

renderer.outputEncoding = THREE.sRGBEncoding;

function render() {
	ps.particleAnimate();

	let deltaTime = clock.getDelta();
	knight.update(deltaTime)

	camera.lookAt(knight.getSprite().position.x, knight.getSprite().position.y + 0.3, knight.getSprite().position.z)


	// originalSceneComposer.swapBuffers();
	// originalSceneComposer.render();

	// // brightSpotsComposer.swapBuffers();
	// // brightSpotsComposer.swapBuffers();
	// brightSpotsComposer.render();

	// finalBloomComposer.swapBuffers();
	// finalBloomComposer.render();
	composer.renderComposers();
	//renderer.render(scene, camera);

}


renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
render();
animate();
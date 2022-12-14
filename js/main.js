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
	
// Load the Orbitcontroller
console.log(camera);
const controls = new OrbitControls(camera, renderer.domElement); 
controls.update();
			
//  // Load Light
 var ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
 scene.add( ambientLight );
// const color = 0xffd700;
// const intensity = 1.5;
// const pointLight = new THREE.PointLight(color, intensity);
// pointLight.position.set(3,2,0);
// scene.add(pointLight);

			
// const light = new THREE.PointLight( 0xcccccc);
// light.position.set( 0, 10, 10 );
// scene.add( light );

//const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// directionalLight.position.set(100, 100, 100);
// directionalLight.target.position.set(0, 0, 0);
//scene.add( directionalLight );

const directionalLight = new THREE.DirectionalLight("0xffffff", 3);
directionalLight.castShadow = true;
directionalLight.position.set(50, 50, 0);
// directionalLight.target.position.set(0, 0, 0);
directionalLight.shadow.bias = -0.0005;
scene.add(directionalLight);
	renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true;


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

console.log(THREE.ShaderLib.points.fragmentShader)

THREE.ShaderLib.points.vertexShader = `

uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

attribute float alpha;
varying float vAlpha;

void main() {

	vAlpha = alpha;

	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}
`

THREE.ShaderLib.points.fragmentShader = `
uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying float vAlpha;

void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

	gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * vAlpha);

}
`


// THREE.ShaderChunk.color_pars_vertex.glsl = `
// #if defined( USE_COLOR_ALPHA )
// 	varying vec4 vColor;
// #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
// 	varying vec3 vColor;
// #endif
// `

// THREE.ShaderChunk.color_vertex = `
// #if defined( USE_COLOR_ALPHA )
// 	vColor = vec4( 1.0 );
// #elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
// 	vColor = vec3( 1.0 );
// #endif
// #ifdef USE_COLOR
// 	vColor *= color;
// #endif
// #ifdef USE_INSTANCING_COLOR
// 	vColor.xyz *= instanceColor.xyz;
// #endif
// `


const tloader = new THREE.TextureLoader();
const map = tloader.load("../images/spark.png")
const alphaMap = tloader.load("../images/spark_alpha.jpg")

const material = new THREE.PointsMaterial({
	size: 0.5,
	color: 0xff3433,
	map: map,
	alphaMap: alphaMap,
	transparent: true,
	blending: THREE.AdditiveBlending
})

//const particlesGeometry = new THREE.BufferGeometry;
var geometry = new THREE.BufferGeometry;
//new THREE.SphereBufferGeometry( 100, 16, 8 );

// add an attribute
var numVertices = 100;
var alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex

for( var i = 0; i < numVertices; i ++ ) {

	// set alpha randomly
	alphas[ i ] = Math.random();

	
}

//https://jsfiddle.net/7htvbwL6/
//https://stackoverflow.com/questions/59448702/map-image-as-texture-to-plane-in-a-custom-shader-in-three-js

geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

// uniforms
var uniforms = {

	color: { value: new THREE.Color( 0xff3433 ) },

};

 // point cloud material
 var shaderMaterial = new THREE.ShaderMaterial( {

	uniforms:       uniforms,
	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
	transparent: true,
	map: {value: map}
});


const particlesCnt = numVertices;

const posArray = new Float32Array(particlesCnt * 3)

for (let i = 0; i < particlesCnt * 3; i = i + 3) {
	// x, y, z
	posArray[i] = (Math.random() - 0.5) * 10
	posArray[i + 1] = (Math.random() - 0.5) * 10
	posArray[i + 2] = (Math.random() - 0.5) * 20
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

var particlesMesh = new THREE.Points(geometry, material)

scene.add(particlesMesh)

console.log(particlesMesh)

// let curAlphas = []
// for (let i = 0; i < particlesCnt; i++) {
// 	curAlphas = [...curAlphas, {"opacity" : 1}]
// }
// console.log(curAlphas)

//TweenLite.to(particlesMesh.material, 1, {opacity: 0});
// for (var i = 0; i < particlesMesh.length; i++) {
// 	new TWEEN.Tween(curAlphas[i])
// 		.to( { opacity:0.0 }, Math.random() * 10000)
// 		.yoyo(true)
// 		.repeat(Infinity)
// 		.easing(TWEEN.Easing.Cubic.InOut)
// 		.start();
// }

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

	particlesMesh.rotation.x += 0.0002;

	var alphas = particlesMesh.geometry.attributes.alpha;
	var count = alphas.count;

    for( var i = 0; i < count; i ++ ) {
    
        // dynamically change alphas
        alphas.array[ i ] *= 0.995;
        
        if ( alphas.array[ i ] < 0.01 ) { 
            alphas.array[ i ] = 1.0;
        }
        
    }

    alphas.needsUpdate = true; // important!

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
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

// Load 3D Scene
var scene = new THREE.Scene(); 
var clock = new THREE.Clock();
	
 // Load a Renderer
var renderer = new THREE.WebGLRenderer({ alpha: false });
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


	renderer.render( scene, camera );
	}

// renderer.physicallyCorrectLights = true
render();
animate();
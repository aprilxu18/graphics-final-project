/**
 * Full-screen textured quad shader
 */

// var basicShader = {

// 	uniforms: {
//         'myTexture': {value: null}
// 		// 'tDiffuse': { value: null },
// 		// 'opacity': { value: 1.0 }

// 	},

// 	vertexShader: /* glsl */`

//     varying vec2 uvCoords;
    
//     void main(){
//         gl_Position = vec4(position, 1.0);
//         uvCoords = uv;
//     }
//     `,
//
// 	fragmentShader: /* glsl */`

//     varying vec2 uvCoords;
//     uniform sampler2D myTexture;

//     void main(){
//         gl_FragColor = texture2D(myTexture, uvCoords) + vec4(0.2, 0.6, 0.2, 0.0);
//     }
//     `

// };

//export { basicShader };

var basicShader = {

	uniforms: {

		'myTexture': { value: null }

	},

	vertexShader: [

		'varying vec2 uvCoords;',

		'void main() {',

		'	uvCoords = uv;',

		'	gl_Position = vec4( position, 1.0 );',

		'}'

	].join( '\n' ),

	fragmentShader: [

		'#include <common>',

		'uniform sampler2D myTexture;',

		'varying vec2 uvCoords;',

		'void main() {',

		'	vec4 texel = texture2D( myTexture, uvCoords );',

		'	gl_FragColor = texel + vec4 (0.0, 0.2, 0.0, 0.0);',

		'}'

	].join( '\n' )

};

export { basicShader };
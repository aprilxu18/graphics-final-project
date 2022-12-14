const brightSpotsShader = {

	uniforms: {

		'tDiffuse': { value: null },

	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		varying vec2 vUv;
		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
            float brightness = dot(vec3(texel.rgb), vec3(0.2126, 0.7152, 0.0722));
            if (brightness >= 0.99f){
                gl_FragColor = vec4(texel.rgb, 1.0);
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
		}`

};

export { brightSpotsShader };
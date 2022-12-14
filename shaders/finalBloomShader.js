const finalBloomShader = {

	uniforms: {

		'myTexture': { value: null },
        'bloom': { value: null}

	},

	vertexShader: /* glsl */`
		varying vec2 TexCoords;
		void main() {
			TexCoords = uv;
			gl_Position = vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D myTexture;
        uniform sampler2D bloom;
		varying vec2 TexCoords;
        
		void main() {
            vec4 color = texture2D(myTexture, TexCoords);
            vec4 bloomColor = texture2D(bloom, TexCoords);
            vec4 result = color + bloomColor;
			// float brightness = dot(vec3(result.rgb), vec3(0.2126, 0.7152, 0.0722));
			// if (brightness> 1.f){
			// 	result = result - vec4(0.6, 0.6, 0.6, 0.0);
			// }
            //result = vec4(1.0) - exp(-result * 2.f);
			// result  = result * 1.2;
            //result = pow(result, vec4(1.0 / 2.2));
            gl_FragColor = result;
		}`

};

export { finalBloomShader };
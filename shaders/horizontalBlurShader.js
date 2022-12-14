const horizontalBlurShader = {

	uniforms: {

		'image': { value: null },

	},

	vertexShader: /* glsl */`
		varying vec2 TexCoords;
		void main() {
			TexCoords = uv;
			gl_Position = vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D image;
		varying vec2 TexCoords;
        
		void main() {
            float weight[10] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216, 0.011, 0.05, 0.01, 0.05, 0.001);
            ivec2 tex_size = textureSize(image, 0);
			vec2 tex_offset = vec2(1.0 / float(tex_size[0]), 1.0 / float(tex_size[1]));
            vec3 result = texture2D(image, TexCoords).rgb * weight[0];
            for(int i = 1; i < 10; ++i)
            {
                result += texture2D(image, TexCoords + vec2(tex_offset.x * float(i), 0.0)).rgb * float(weight[i]);
                result += texture2D(image, TexCoords - vec2(tex_offset.x * float(i), 0.0)).rgb * float(weight[i]);
            }
            gl_FragColor = vec4(result, 1.0);
		}`

};

export { horizontalBlurShader };
const BackgroundOverlayShader = {

    name: 'BackgroundOverlayShader',

    uniforms: {

        'tDiffuse': { value: null },
        'uTexture': { value: null }
    },

    vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;
		uniform sampler2D uTexture;

		varying vec2 vUv;

        vec3 BlendOverLay(vec3 baseColor, vec3 blendColor)
        {
            return (2.0 * baseColor * blendColor);
        }
		void main() {

            float overlay = texture2D(uTexture, vUv).r;
            vec4 col = texture2D(tDiffuse, vUv);

            col.rgb = BlendOverLay(col.rgb, vec3(overlay));
			gl_FragColor = col;
		}`
};

export { BackgroundOverlayShader };
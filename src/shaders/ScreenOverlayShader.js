const screenOverlayShader = {

    name: 'ScreenOverlayShader',

    uniforms: {

        'tDiffuse': { value: null },
        'uTexture': { value: null },
        'uOverlay': { value: 0 }
    },

    vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: /* glsl */`

		uniform float uOverlay;
		uniform sampler2D tDiffuse;
		uniform sampler2D uTexture;

		varying vec2 vUv;

        vec3 BlendOverLay(vec3 baseColor, vec3 blendColor, float lerp)
        {
            return mix(baseColor, (2.0 * baseColor * blendColor), lerp);
        }

		void main() {

            float overlay = texture2D(uTexture, vUv).r;
            vec4 col = texture2D(tDiffuse, vUv);

            col.rgb = BlendOverLay(col.rgb, vec3(overlay), uOverlay);
			gl_FragColor = col;
		}`
};

export { screenOverlayShader };
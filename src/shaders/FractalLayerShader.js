import noise from "../three.js-gist/Shader/Cginc/Noise"
import fractal from "../three.js-gist/Shader/Cginc/Fractal"
import utility from "../three.js-gist/Shader/Cginc/Utility"
import photoshopMath from "../three.js-gist/Shader/Cginc/PhotoshopMath"

export const fragmentShader = /*glsl*/`

${noise}
${fractal}
${utility}
${photoshopMath}

varying vec2 vUv;
uniform sampler2D uBackgroundTex;
uniform float uTime;
uniform float uSpeed;
uniform float uSeed;
uniform float uRatio;
uniform float uWtoH;

float getFractal(vec2 uv) {
	vec3 p = vec3(uv, uTime * uSpeed);

	float value;
	value = simplex3d_fractal(p);

	value = Contrast(value, 90.0) * 0.2;
	value = clamp(value, 0.0, 1.0);
	return value;
}

void main() {
	vec4 col = texture2D(uBackgroundTex, vUv) * 1.0;

	vec2 turbulence = (vec2(gradientNoise(vUv, 100.0), gradientNoise(vUv + vec2(57.68, 0.0), 100.0)) - 0.5) * 2.0 * 0.01;

	vec2 uv = vUv * vec2(uWtoH, 1.0);
	uv = uv * 1.5 + scatter(uv, 0.02) + uSeed * 123.45 + turbulence;

	float fractal = getFractal(uv);

	float fade = smoothEdge(vUv, vec2(0.1)) * smoothstep(0.0, 0.2, uRatio) * smoothstep(1.0, 0.8, uRatio);
	col.a = fractal * fade;
	// col.rgba = vec4(1.0);
	// col.a = 1.0;

	gl_FragColor = col;
}
`


import fractal from "../three.js-gist/Shader/Cginc/Fractal"
import noise from "../three.js-gist/Shader/Cginc/Noise"
import utility from "../three.js-gist/Shader/Cginc/Utility"

const fragment = /* glsl */ `

${fractal}
${noise}
${utility}

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;

float getFractal(vec2 uv) {
	vec3 p = vec3(uv, uTime * uSpeed);

	float value;
	value = simplex3d_fractal(p);
	value = 0.5 + 0.5 * value;

	value = Contrast(value, 118.0) * 0.015;
	value = clamp(value, 0.0, 1.0);
	return value;
}

void main() {
	vec4 textureColor = texture2D(uTexture, vUv);

	float turbulence = (gradientNoise(vUv, 100.0) - 0.5) * 2.0 * 0.01;
	vec2 uv1 = vUv * 0.5 + scatter(vUv, 0.1) + turbulence;
	vec2 uv2 = uv1 + 123.45 + turbulence; // random seed

	float f1 = getFractal(uv1);
	float f2 = getFractal(uv2);

	vec4 col = textureColor * (f1 + f2);
	col.a = 1.0;
	gl_FragColor = col;

}`

export default fragment
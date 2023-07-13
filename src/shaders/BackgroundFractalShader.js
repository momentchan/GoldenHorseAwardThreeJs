import fractal from "../three.js-gist/Shader/Cginc/Fractal"
import gradientNoise from "../three.js-gist/Shader/Cginc/GradientNoise"

const fragment = /* glsl */ `

${fractal}
${gradientNoise}

float Contrast(float In, float Contrast) {
	float midpoint = pow(0.5, 2.2);
	return (In - midpoint) * Contrast + midpoint;
}

float noise(vec2 co) {
	vec2 seed = vec2(sin(co.x), cos(co.y));
	return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 Scatter(vec2 uv, float radius) {
	return -radius + vec2(noise(uv), noise(uv.yx)) * radius * 2.0;
}
float remap(float In, vec2 InMinMax, vec2 OutMinMax) {
	return OutMinMax.x + (In - InMinMax.x) * (OutMinMax.y - OutMinMax.x) / (InMinMax.y - InMinMax.x);
}
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
	vec2 uv1 = vUv * 0.5 + Scatter(vUv, 0.1) + turbulence;
	vec2 uv2 = uv1 + 123.45 + turbulence; // random seed

	float f1 = getFractal(uv1);
	float f2 = getFractal(uv2);

	vec4 col = textureColor * (f1 + f2);
	col.a = 1.0;
	gl_FragColor = col;

}`

export default fragment
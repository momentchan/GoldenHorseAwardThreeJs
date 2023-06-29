varying vec2 vUv;
uniform float uDistortionFrequency;
uniform float uDistortionStrength;
uniform float uSeed;


void main() {

	vec3 pos = position;
	pos.x += sin(uv.y * uDistortionFrequency + uSeed * 6.28) * uDistortionStrength;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	vUv = uv;
}
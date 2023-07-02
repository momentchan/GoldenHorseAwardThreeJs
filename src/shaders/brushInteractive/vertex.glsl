varying vec2 vUv;
uniform float uDistortionFrequency;
uniform float uDistortionStrength;
uniform float uSeed;

void main() {

	vec3 pos = position;
	pos.x += sin(uv.y * uDistortionFrequency + uSeed * 6.28) * uDistortionStrength;

	vec4 localPosition = vec4(pos, 1.);

	vec4 worldPosition = modelMatrix * localPosition;

	worldPosition = vec4((uv.x - 0.5) * 0.5, (uv.y - 0.5) * 0.5, -8.0, 1.0);

	vec4 viewPosition = viewMatrix * worldPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition; //either orthographic or perspective

	gl_Position = projectedPosition;
}
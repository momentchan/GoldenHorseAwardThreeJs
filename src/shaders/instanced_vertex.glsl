vec3 mod289(vec3 x) {
	return x - floor(x / 289.0) * 289.0;
}

vec2 mod289(vec2 x) {
	return x - floor(x / 289.0) * 289.0;
}

vec3 permute(vec3 x) {
	return mod289((x * 34.0 + 1.0) * x);
}

vec3 taylorInvSqrt(vec3 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    // First corner
	vec2 i = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);

    // Other corners
	vec2 i1;
	i1.x = step(x0.y, x0.x);
	i1.y = 1.0 - i1.x;

	vec2 x1 = x0 + C.xx - i1;
	vec2 x2 = x0 + C.zz;

	i = mod289(i);
	vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
	m = m * m;
	m = m * m;

	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	m *= taylorInvSqrt(a0 * a0 + h * h);

	vec3 g;
	g.x = a0.x * x0.x + h.x * x0.y;
	g.y = a0.y * x1.x + h.y * x1.y;
	g.z = a0.z * x2.x + h.z * x2.y;
	return 130.0 * dot(m, g);
}

varying vec2 vUv;
varying float vSeedBuffer;
varying vec4 vUvBuffer;

attribute float seedBuffer;
attribute vec4 uvBuffer;

void main() {
	vec2 strokeUv = vec2(mix(uvBuffer.x, uvBuffer.y, uv.x), mix(uvBuffer.z, uvBuffer.w, uv.y));

	float offset = sin(strokeUv.y * 6.128 * 2.0 ) * 0.1 + snoise(vec2(strokeUv.y * 2.0, seedBuffer)) * 0.2;
     // Perform your vertex transformations
    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
	worldPosition.x += offset;

    vec4 viewPosition = viewMatrix * worldPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Set the transformed vertex position
    gl_Position = projectedPosition;

    vUv = uv;

    vUvBuffer = uvBuffer;
    vSeedBuffer = seedBuffer;
}
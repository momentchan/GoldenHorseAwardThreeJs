float noise(vec2 co) {
	vec2 seed = vec2(sin(co.x), cos(co.y));
	return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothEdge(vec2 uv, vec2 smoothness) {
	return smoothstep(0.0, smoothness.x, uv.x) * smoothstep(1.0, 1.0 - smoothness.x, uv.x) * smoothstep(0.0, smoothness.y, uv.y) * smoothstep(1.0, 1.0 - smoothness.y, uv.y);
}

float drawEllipse(vec2 uv, vec2 center, float width, float height) {
	uv -= (center - 0.5);
	float d = length((uv * 2.0 - 1.0) / vec2(width, height));
	return clamp((1.0 - d) / fwidth(d), 0.0, 1.0);
}

vec3 hueShift(vec3 col, float Offset) {
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 P = mix(vec4(col.bg, K.wz), vec4(col.gb, K.xy), step(col.b, col.g));
	vec4 Q = mix(vec4(P.xyw, col.r), vec4(col.r, P.yzx), step(P.x, col.r));
	float D = Q.x - min(Q.w, Q.y);
	float E = 1e-10;
	vec3 hsv = vec3(abs(Q.z + (Q.w - Q.y) / (6.0 * D + E)), D / (Q.x + E), Q.x);

	float hue = hsv.x + Offset / 360.0;
	hsv.x = (hue < 0.0) ? hue + 1.0 : (hue > 1.0) ? hue - 1.0 : hue;

	vec4 K2 = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 P2 = abs(fract(hsv.xxx + K2.xyz) * 6.0 - K2.www);
	return hsv.z * mix(K2.xxx, clamp(P2 - K2.xxx, 0.0, 1.0), hsv.y);
}

float drawBrush(vec2 uv, float time, float strength, float seed) {
	float n = noise(vec2(float(seed) * 0.45, float(seed) * 1.89));

	float delay = -mix(0.0, 0.5, fract(n * 32.5));
	float speed = mix(0.1, 0.2, fract(n * 69.3));

	float r = time * speed;
	float fade = 1.0 - smoothstep(delay + r, delay + r + 0.05, uv.y);

	float o = drawEllipse(uv, vec2(0.5, 0.5), 1.0, 1.0) * strength * fade;
	return clamp(o, 0.0, 1.0);
}

varying vec2 vUv;
varying float vSeedBuffer;
varying vec4 vUvBuffer;

uniform sampler2D uBackgroundTex;
uniform sampler2D uStrokeTex;
uniform float uStrength;
uniform float uTime;
uniform float uRatio;
uniform float uColorStrength;

void main() {
	vec4 background = texture2D(uBackgroundTex, vUv);
	background.rgb = hueShift(background.rgb, -30.0) * uColorStrength;

	vec2 strokeUv = vec2(mix(vUvBuffer.x, vUvBuffer.y, vUv.x), mix(vUvBuffer.z, vUvBuffer.w, vUv.y));
	float stroke = texture2D(uStrokeTex, strokeUv).r;

	vec2 uv = vUv;
	float b = drawBrush(uv, uTime, uStrength, vSeedBuffer);

	vec4 col = b * stroke * background * 5.0;
	float fade = smoothstep(0.0, 0.05, uRatio) * smoothstep(1.0, 0.9, uRatio);
	col.a = b * fade;

	//col.r = mix(vUvBuffer.x, vUvBuffer.y, vUv.x);
	//col.g = mix(vUvBuffer.z, vUvBuffer.w, vUv.y);
	//col.b = 0.0;
	//col.a = 1.0;

	// col.rgba = vec4(stroke);
	gl_FragColor = col;
}
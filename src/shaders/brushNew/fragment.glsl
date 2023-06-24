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

float nrand(vec2 co) {
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

float drawSingleBrush(vec2 uv, float n, float width, float height, float drawRate, float strength) {
	float offset = snoise(vec2(n, uv.y * 2.0)) * 0.1;

	float x = mix(-0.2, 0.2, n);
	float y = mix(-0.5, 0.5, fract(n * 132.0));
	float w = mix(0.5, 1.5, fract(n * 43.3)) * width;
	float h = mix(0.6, 1.0, fract(n * 123.8)) * height;

	float s = mix(0.1, 1.0, fract(n * 35.5)) * strength;

	float delay = -mix(0.0, 0.5, fract(n * 32.5));
	float speed = mix(0.1, 0.15, fract(n * 69.3));

	float r = drawRate * speed;
	float fade = 1.0 - smoothstep(delay + r, delay + r + 0.05, uv.y + 0.5);

	// fade = 1.0;

	return clamp(drawEllipse(uv + offset, vec2(x, y), w, h) * s * fade, 0.0, 1.0);
}

float drawBrush(vec2 uv, vec2 id, float layer, float width, float height, float ratio, float strength) {
	float o = 0.0;
	for(int x = -1; x <= 1; x++) {
		vec2 offs = vec2(x, 0.0);

		float n = nrand(id + offs + layer);
		o += drawSingleBrush(uv - offs, n, width, height, ratio, strength) / 3.0;
		o = clamp(o, 0.0, 1.0);
	}

	// if(uv.x > .48 || uv.y > .48) o = 1.0;
	return o;
}

varying vec2 vUv;

uniform sampler2D uColorTex;
uniform sampler2D uStrokeTex;
uniform float uCount;
uniform float uLayer;
uniform float uWitdh;
uniform float uHeight;
uniform float uStrength;
uniform float uDrawRate;
uniform float uHueShift;
uniform float uColorStrength;
uniform float uRatio;

void main() {
	vec2 uv = vUv;
	uv.x *= uCount;

	float b = 0.0;
	for(float l = 0.0; l < uLayer; l++) {
		float n = nrand(vec2(l * 130.45, 0.0));

		vec2 uv0 = uv;
		uv0.x += n * uCount;
		vec2 id = floor(uv0);
		vec2 gv = fract(uv0) - 0.5;

		b += drawBrush(gv, id, l, uWitdh, uHeight, uDrawRate, uStrength);
		b = clamp(b, 0.0, 1.0);
	}

	vec4 color = texture2D(uColorTex, vUv);
	color.rgb = hueShift(color.rgb, uHueShift) * uColorStrength;

	vec4 stroke = texture2D(uStrokeTex, vUv);

	// gamma correction
	float b_gamma = pow(b, 1.0 / 2.2);

	vec4 col = color * b_gamma * stroke.r;
	// col = vec4(b_gamma);

	float fade = 0.1 + mix(0.0, 1.9, smoothstep(0.5, 1.0, uRatio));
	col.a = b * smoothEdge(vUv, vec2(fade, 0.1));
	// col.a = 1.0;

	gl_FragColor = col;
}
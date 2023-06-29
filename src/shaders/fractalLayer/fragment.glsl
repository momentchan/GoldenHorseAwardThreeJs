vec2 gradientNoise_dir(vec2 p) {
	p = mod(p, 289.0);
	float x = mod((34.0 * p.x + 1.0) * p.x, 289.0) + p.y;
	x = mod((34.0 * x + 1.0) * x, 289.0);
	x = fract(x / 41.0) * 2.0 - 1.0;
	return normalize(vec2(x - floor(x + 0.5), abs(x) - 0.5));
}

float gradientNoise(vec2 p) {
	vec2 ip = floor(p);
	vec2 fp = fract(p);
	float d00 = dot(gradientNoise_dir(ip), fp);
	float d01 = dot(gradientNoise_dir(ip + vec2(0.0, 1.0)), fp - vec2(0.0, 1.0));
	float d10 = dot(gradientNoise_dir(ip + vec2(1.0, 0.0)), fp - vec2(1.0, 0.0));
	float d11 = dot(gradientNoise_dir(ip + vec2(1.0, 1.0)), fp - vec2(1.0, 1.0));
	fp = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
	return mix(mix(d00, d01, fp.y), mix(d10, d11, fp.y), fp.x);
}

float gradientNoise(vec2 UV, float Scale) {
	return gradientNoise(UV * Scale) + 0.5;
}

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0 * j);
	j *= .125;
	r.x = fract(512.0 * j);
	j *= .125;
	r.y = fract(512.0 * j);
	return r - 0.5;
}

/* skew constants for 3d simplex functions */
const float F3 = 0.3333333;
const float G3 = 0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

	 /* calculate s and x */
	vec3 s = floor(p + dot(p, vec3(F3)));
	vec3 x = p - s + dot(s, vec3(G3));

	 /* calculate i1 and i2 */
	vec3 e = step(vec3(0.0), x - x.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);

	 /* x1, x2, x3 */
	vec3 x1 = x - i1 + G3;
	vec3 x2 = x - i2 + 2.0 * G3;
	vec3 x3 = x - 1.0 + 3.0 * G3;

	 /* 2. find four surflets and store them in d */
	vec4 w, d;

	 /* calculate surflet weights */
	w.x = dot(x, x);
	w.y = dot(x1, x1);
	w.z = dot(x2, x2);
	w.w = dot(x3, x3);

	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	w = max(0.6 - w, 0.0);

	 /* calculate surflet components */
	d.x = dot(random3(s), x);
	d.y = dot(random3(s + i1), x1);
	d.z = dot(random3(s + i2), x2);
	d.w = dot(random3(s + 1.0), x3);

	 /* multiply d by w^4 */
	w *= w;
	w *= w;
	d *= w;

	 /* 3. return the sum of the four surflets */
	return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85, -0.14, -0.93, 0.34, 0.92, 0.01, 0.4);
const mat3 rot2 = mat3(-0.55, -0.39, 0.74, 0.33, -0.91, -0.24, 0.77, 0.12, 0.63);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
	return 0.5333333 * simplex3d(m * rot1) + 0.2666667 * simplex3d(2.0 * m * rot2);
}

float Contrast(float In, float Contrast) {
	float midpoint = pow(0.5, 2.2);
	return (In - midpoint) * Contrast + midpoint;
}

vec2 Scatter(vec2 uv, float radius) {
	return -radius + vec2(gradientNoise(uv, 2000.0), gradientNoise(uv.yx, 2000.0)) * radius * 2.0;
}

float smoothEdge(vec2 uv, vec2 smoothness) {
	return smoothstep(0.0, smoothness.x, uv.x) * smoothstep(1.0, 1.0 - smoothness.x, uv.x) * smoothstep(0.0, smoothness.y, uv.y) * smoothstep(1.0, 1.0 - smoothness.y, uv.y);
}

vec3 BlendOverLay(vec3 baseColor, vec3 blendColor, float lerp) {
	return mix(baseColor, (2.0 * baseColor * blendColor), lerp);
}

varying vec2 vUv;
uniform sampler2D uColorTex;
uniform sampler2D uPaperTex;
uniform float uTime;
uniform float uSpeed;
uniform float uSeed;
uniform float uRatio;

float getFractal(vec2 uv) {
	vec3 p = vec3(uv, uTime * uSpeed);

	float value;
	value = simplex3d_fractal(p);

	value = Contrast(value, 90.0) * 0.2;
	value = clamp(value, 0.0, 1.0);
	return value;
}

void main() {
	vec4 color = texture2D(uColorTex, vUv);
	vec4 paper = texture2D(uPaperTex, vUv);

	vec2 turbulence = (vec2(gradientNoise(vUv, 100.0), gradientNoise(vUv + vec2(57.68, 0.0), 100.0)) - 0.5) * 2.0 * 0.01;

	vec2 uv = vUv * 1.78 + Scatter(vUv, 0.02) + uSeed * 123.45 + turbulence;

	float f = getFractal(uv);
	vec4 col = color * 1.2;
	// col.rgb = BlendOverLay(col.rgb, paper.rgb, 0.5);

	float fade = smoothEdge(vUv, vec2(0.1)) * smoothstep(0.0, 0.05, uRatio) * smoothstep(1.0, 0.9, uRatio);
	col.a = f * fade;

	gl_FragColor = col;
}
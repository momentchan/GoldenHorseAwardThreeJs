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

varying vec2 vUv;
varying float vSeedBuffer;
varying vec4 vPos;
uniform float uTime;
attribute float seedBuffer;

void main() {
	vec3 p1 = position;
	vec4 pos = instanceMatrix * vec4(p1, 1.0);
	vec4 worldPosition = modelMatrix * pos;
	vec3 seed = vec3(worldPosition.xy + seedBuffer * 12.3, uTime * 0.1);

	seed.xy *= 0.5;
	float offset1 = simplex3d_fractal(seed) * 0.0;

	seed.xy *= 5.0;
	float offset2 = simplex3d_fractal(seed) * 0.05;

	float up = sin(uTime * 0.1 + seedBuffer * 23.45) * 0.1;

	worldPosition.y += offset1 + offset2 + up;

	vec4 viewPosition = viewMatrix * worldPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;

	vPos = projectedPosition;
	vUv = uv;

	vSeedBuffer = seedBuffer;
}
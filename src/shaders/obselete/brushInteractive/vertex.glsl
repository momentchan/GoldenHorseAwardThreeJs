varying vec2 vUv;
uniform sampler2D uPositionTex;
uniform sampler2D uNormalTex;

void main() {
	vec3 pos = texture2D(uPositionTex, vec2(0.5, uv.y)).rgb;
	vec3 normal = texture2D(uNormalTex, vec2(0.5, uv.y)).rgb;

	vec3 orth = vec3(normal.y, -normal.x, 0);

	pos.xy += orth.xy * (uv.x - 0.5) * 0.1;

	vec4 viewPosition = viewMatrix *  vec4(pos, 1.0);
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;
	vUv = uv;
}
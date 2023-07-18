export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform float uRatio;
    uniform sampler2D uLightTex;
    uniform sampler2D uDotTex;

    float drawCircle(vec2 uv, float radius) {
        vec2 center = vec2(0.5, 0.5);
        float distance = length((uv - center));
        float gradient = smoothstep(radius, radius - 0.3, distance);
        return gradient;
    }

    void main() {
        vec4 col = texture2D(uLightTex, vUv);
        vec4 dot = texture2D(uDotTex, vUv * 1.0);
        if(col.a == 0.0)
            discard;

        col.rgb = vec3(texture2D(uLightTex, vUv).r);
        float fade = drawCircle(vUv, uRatio) * smoothstep(1.0, 0.7, uRatio);

        vec2 uv = vec2(0.375, 1.0) * vUv;
        col.a *= fade * (0.3 + dot.r * 0.2);

        gl_FragColor = col;
    }`
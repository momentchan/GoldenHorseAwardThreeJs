export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform float uRatio;
    uniform float uStrength;
    uniform sampler2D uLightTex;
    uniform vec3 uColor;

    float drawCircle(vec2 uv, float radius) {
        vec2 center = vec2(0.5, 0.5);
        float distance = length((uv - center));
        float gradient = smoothstep(radius, radius - 0.3, distance);
        return gradient;
    }

    void main() {
        vec4 col = texture2D(uLightTex, vUv);
        if(col.a == 0.0)
            discard;

        col.rgb *= uColor;

        float fade = drawCircle(vUv, uRatio) * smoothstep(1.0, 0.7, uRatio);
        col.a *= fade * uStrength;

        gl_FragColor = col;
    }`
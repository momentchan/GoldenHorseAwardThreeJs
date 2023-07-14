export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform float uRatio;
    uniform sampler2D uLightTex;
    uniform sampler2D uStrokeTex;

    float drawCircle(vec2 uv, float radius) {
        vec2 center = vec2(0.5, 0.5);
        float distance = length((uv - center));
        float gradient = smoothstep(radius, radius - 0.2, distance);
        return gradient;
    }

    void main() {
        vec4 col = texture2D(uLightTex, vUv);
        vec4 stroke = texture2D(uStrokeTex, vUv * 1.0);
        if(col.a == 0.0)
            discard;

        col.rgb = vec3(texture2D(uLightTex, vUv).r);
        float fade = drawCircle(vUv, uRatio) * smoothstep(1.0, 0.5, uRatio);

        vec2 uv = vec2(0.375, 1.0) * vUv;
        col.a *= fade * (0.5 + stroke.r * 0.2);

        gl_FragColor = col;
    }`
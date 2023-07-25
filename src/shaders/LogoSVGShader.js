export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform float uRatio;
    uniform vec3 uColor;

    void main() {
        vec4 col = vec4(uColor, 1.0);
        float fade = smoothstep(1.0, 0.5, uRatio);
        col.a *= fade;
    
        gl_FragColor = col;
    }`
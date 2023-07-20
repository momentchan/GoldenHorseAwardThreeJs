export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uRatio;

    void main() {
        vec4 col = texture2D(uTexture, vUv);
        float fade = smoothstep(1.0, 0.5, uRatio);
        col.a *= fade;
    
        gl_FragColor = col;
    }`
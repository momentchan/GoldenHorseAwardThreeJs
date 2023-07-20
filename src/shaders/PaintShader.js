export const fragmentShader = /* glsl */`

    varying vec2 vUv;
    uniform sampler2D uPaintTex;
    uniform float uStrength;
    uniform float uRatio;
    uniform vec3 uColor;

    void main() {
        vec4 col = texture2D(uPaintTex, vUv);
        if(col.a == 0.0)
            discard;
        
        col.rgb *= uColor;
    
        float fade = smoothstep(0.0, 0.3, uRatio) * smoothstep(1.0, 0.7, uRatio);
        col.a *= fade * uStrength;
    
        gl_FragColor = col;
    }`
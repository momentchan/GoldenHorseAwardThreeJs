import noise from "../three.js-gist/Shader/Cginc/Noise"
import photoshopMath from "../three.js-gist/Shader/Cginc/PhotoshopMath"
import utility from "../three.js-gist/Shader/Cginc/Utility"

export const fragmentShader = /* glsl */`

        ${noise}
        ${photoshopMath}
        ${utility}
        
        varying vec2 vUv;
        
        uniform sampler2D uPaintTex;
        uniform float uStrength;
        uniform float uRatio;
        uniform vec3 uColor;

        void main() {
            vec4 col = texture2D(uPaintTex, vUv);

            if(col.a == 0.0)
                discard;
            
            col.rgb = vec3(texture2D(uPaintTex, vUv).r) * uColor;
        
            float fade = smoothstep(0.0, 0.3, uRatio) * smoothstep(1.0, 0.7, uRatio);
            col.a *= fade * 0.2;// * uStrength;
        
            gl_FragColor = col;
        }`
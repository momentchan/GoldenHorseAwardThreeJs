import noise from "../three.js-gist/Shader/Cginc/Noise"
import photoshopMath from "../three.js-gist/Shader/Cginc/PhotoshopMath"
import utility from "../three.js-gist/Shader/Cginc/Utility"

export const fragmentShader = /* glsl */`

        ${noise}
        ${photoshopMath}
        ${utility}
        
        varying vec2 vUv;
        
        uniform sampler2D uBackgroundTex;
        uniform sampler2D uPaintTex;
        uniform float uStrength;
        uniform float uRatio;
        
        void main() {
            vec4 col = texture2D(uPaintTex, vUv);
            if(col.a == 0.0)
                discard;

            vec4 bg = texture2D(uBackgroundTex, vUv);
        
            // col.rgb = BlendOverLay(col.rgb, bg.rgb, 1.0);
        
            float fade = smoothstep(0.0, 0.3, uRatio) * smoothstep(1.0, 0.7, uRatio);
        
            col.a *= fade * uStrength;
        
            gl_FragColor = col;
        }`
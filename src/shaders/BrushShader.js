import noise from "../three.js-gist/Shader/Cginc/Noise"
import photoshopMath from "../three.js-gist/Shader/Cginc/PhotoshopMath"
import utility from "../three.js-gist/Shader/Cginc/Utility"

export const vertexShader = /* glsl */`

        varying vec2 vUv;
        uniform float uDistortionFrequency;
        uniform float uDistortionStrength;
        uniform float uSeed;
        
        void main() {
        
            vec3 pos = position;
            pos.x += sin(uv.y * uDistortionFrequency + uSeed * 6.28) * uDistortionStrength;
        
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            vUv = uv;
        }`

export const fragmentShader = /* glsl */`

        ${noise}
        ${photoshopMath}
        ${utility}
        
        varying vec2 vUv;
        
        uniform sampler2D uBackgroundTex;
        uniform sampler2D uStrokeTex;
        uniform float uStrength;
        uniform float uHue;
        uniform float uRatio;
        uniform float uSeed;
        uniform float uSpeed;
        
        void main() {
            vec4 col = texture2D(uStrokeTex, vUv);
            vec4 bg = texture2D(uBackgroundTex, vUv);
        
            col.rgb = BlendOverLay(col.rgb, bg.rgb, 1.0);
        
            col.rgb = HSVShift(col.rgb, vec3(uHue, 1.0, 0.0));
        
            // alpha animation
            float n = gradientNoise(vec2(vUv.x) + uSeed * 123.45, 50.0);
            n = remap(n, vec2(0.0, 1.0), vec2(-0.3, 0.0));
        
            float r = n;
            // ramp
            r -= pow(abs(vUv.x - 0.5), 1.5);
            r += uRatio * uSpeed;
        
            float alpha = col.a * smoothstep(r + 0.2, r, vUv.y);
        
            // make edge less visible
            float mask = smoothstep(alpha, 1.0, 0.95);
            mask *= remap(gradientNoise(vUv, 1.0), vec2(0.0, 1.0), vec2(-0.1, 0.0));
            mask *= alpha;
            alpha += mask;
        
            float fade = 0.3 + mix(0.0, 1.9, smoothstep(0.5, 1.0, uRatio));
            alpha *= smoothEdge(vUv, vec2(fade, 0.2));
        
            col.a = alpha * uStrength;
        
            // col.rg = vUv;
            // col.b=0.0;
            // col.a = 1.0;
            gl_FragColor = col;
        }`
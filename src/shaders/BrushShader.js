import gradientNoise from "../three.js-gist/Shader/Cginc/GradientNoise"
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

        ${gradientNoise}
        
        float remap(float In, vec2 InMinMax, vec2 OutMinMax) {
            return OutMinMax.x + (In - InMinMax.x) * (OutMinMax.y - OutMinMax.x) / (InMinMax.y - InMinMax.x);
        }
        
        vec3 mod289(vec3 x) {
            return x - floor(x / 289.0) * 289.0;
        }
        
        vec2 mod289(vec2 x) {
            return x - floor(x / 289.0) * 289.0;
        }
        
        vec3 permute(vec3 x) {
            return mod289((x * 34.0 + 1.0) * x);
        }
        
        vec3 taylorInvSqrt(vec3 r) {
            return 1.79284291400159 - 0.85373472095314 * r;
        }
        
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            // First corner
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
        
            // Other corners
            vec2 i1;
            i1.x = step(x0.y, x0.x);
            i1.y = 1.0 - i1.x;
        
            vec2 x1 = x0 + C.xx - i1;
            vec2 x2 = x0 + C.zz;
        
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
            m = m * m;
            m = m * m;
        
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
        
            m *= taylorInvSqrt(a0 * a0 + h * h);
        
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.y = a0.y * x1.x + h.y * x1.y;
            g.z = a0.z * x2.x + h.z * x2.y;
            return 130.0 * dot(m, g);
        }
        
        float nrand(vec2 co) {
            vec2 seed = vec2(sin(co.x), cos(co.y));
            return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float smoothEdge(vec2 uv, vec2 smoothness) {
            return smoothstep(0.0, smoothness.x, uv.x) * smoothstep(1.0, 1.0 - smoothness.x, uv.x) * smoothstep(0.0, smoothness.y, uv.y) * smoothstep(1.0, 1.0 - smoothness.y, uv.y);
        }
        
        vec3 hueShift(vec3 col, float Offset) {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 P = mix(vec4(col.bg, K.wz), vec4(col.gb, K.xy), step(col.b, col.g));
            vec4 Q = mix(vec4(P.xyw, col.r), vec4(col.r, P.yzx), step(P.x, col.r));
            float D = Q.x - min(Q.w, Q.y);
            float E = 1e-10;
            vec3 hsv = vec3(abs(Q.z + (Q.w - Q.y) / (6.0 * D + E)), D / (Q.x + E), Q.x);
        
            float hue = hsv.x + Offset / 360.0;
            hsv.x = (hue < 0.0) ? hue + 1.0 : (hue > 1.0) ? hue - 1.0 : hue;
        
            vec4 K2 = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 P2 = abs(fract(hsv.xxx + K2.xyz) * 6.0 - K2.www);
            return hsv.z * mix(K2.xxx, clamp(P2 - K2.xxx, 0.0, 1.0), hsv.y);
        }
        
        vec3 BlendOverLay(vec3 baseColor, vec3 blendColor, float lerp) {
            return mix(baseColor, (2.0 * baseColor * blendColor), lerp);
        }
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        vec3 rgb2hsv(vec3 c) {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        
            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        vec3 HSVShift(vec3 baseColor, vec3 shift) {
            vec3 hsv = rgb2hsv(baseColor);
            hsv = hsv + shift.xyz;
            hsv.yz = clamp(hsv.yz, 0.0, 1.0);
            return hsv2rgb(hsv);
        }
        
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
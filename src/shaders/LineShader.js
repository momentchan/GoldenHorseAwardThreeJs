import fractal from "../three.js-gist/Shader/Cginc/Fractal"
import noise from "../three.js-gist/Shader/Cginc/Noise"
import photoshopMath from "../three.js-gist/Shader/Cginc/PhotoshopMath"
import utility from "../three.js-gist/Shader/Cginc/Utility"

export const vertexShader = /* glsl */`

    ${noise}
    ${fractal}

    varying vec2 vUv;
    varying float vSeedBuffer;
    varying vec4 vPos;
    uniform float uTime;
    attribute float seedBuffer;

    void main() {
        vec3 p1 = position;
        vec4 pos = instanceMatrix * vec4(p1, 1.0);
        vec4 worldPosition = modelMatrix * pos;
        vec3 seed = vec3(worldPosition.xy + seedBuffer * 12.3, uTime * 0.1);

        seed.xy *= 5.0;
        float offset = simplex3d_fractal(seed) * 0.05;

        float up = sin(uTime * 0.1 + seedBuffer * 23.45) * 0.0;

        worldPosition.y += offset + up;

        vec4 viewPosition = viewMatrix * worldPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;

        vPos = projectedPosition;
        vUv = uv;

        vSeedBuffer = seedBuffer;
    }`

export const fragmentShader = /* glsl */`

    ${noise}
    ${photoshopMath}
    ${utility}

    varying vec2 vUv;
    varying vec4 vPos;
    uniform sampler2D uBackgroundTex;
    uniform sampler2D uFractalTex;

    void main() {
        vec2 vCoords = vPos.xy;
        vCoords /= vPos.w;
        vCoords = vCoords * 0.5 + 0.5;
        vec2 screenUv = fract(vCoords * 1.0);

        vec4 background = texture2D(uBackgroundTex, screenUv);

        float noise = remap(gradientNoise(vUv, 2.0), vec2(0.0, 1.0), vec2(0.5, 1.0));

        float fractal = texture2D(uFractalTex, screenUv).r;
        float mask = fractal;

        vec4 col = vec4(1.0);
        col.rgb = BlendOverLay(col.rgb, background.rgb, 0.5) * 0.2;

        col.a *= noise * mask;

        gl_FragColor = col;
    }`
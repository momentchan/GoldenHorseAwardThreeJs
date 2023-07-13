import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/LightShader.js'
import Instance from '../basis/Instance'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import { randFloat } from 'three/src/math/MathUtils'
import { MathUtils } from 'three'


export default class Light extends Instance {
    constructor(generator, id, pos) {
        super(generator, id)

        this.writer = this.generator.writer
        this.scene = this.writer.scene
        this.camera = this.writer.camera

        this.setupMesh(pos)
    }

    setupMesh(pos) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)
        const size = randomRange(this.parameters.size)
        const geometry = new THREE.PlaneGeometry(size, size);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending,

            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.0001 },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uLightTex: { value: this.items.lightTex1 },
                uFractalScale: { value: randomRange(this.parameters.fractalScale) },
                uFractalStrength: { value: randomRange(this.parameters.fractalStrength) },
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.rotateZ(THREE.MathUtils.degToRad(randFloat(0, 360)))
        this.mesh.position.set(wpos.x, wpos.y, wpos.z)
        this.scene.add(this.mesh);
    }

    update() {
        this.t += this.time.delta
        const r = this.t / this.lifetime
        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uRatio.value = r

        // console.log(r)
        if (r > 1) {
            this.destroy()
        }
    }
}
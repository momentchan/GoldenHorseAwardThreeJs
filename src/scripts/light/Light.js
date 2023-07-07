import * as THREE from 'three'
import vertexShader from '../../shaders/screen_vertex.glsl'
import fragmentShader from '../../shaders/light/fragment.glsl'
import Instance from '../basis/Instance'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import { randFloat } from 'three/src/math/MathUtils'

export default class Light extends Instance {
    constructor(generator, id, pos) {
        super(generator, id)
        this.setupMesh(pos)
    }

    setupMesh(pos) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)

        const size = randomRange(this.parameters.size)
        const geometry = new THREE.PlaneGeometry(size, size * randFloat(0.5, 1.5));

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,

            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.0001 },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uColorTex: { value: this.items.backgroundTex },
                uFractalScale: { value: randomRange(this.parameters.fractalScale) },
                uFractalStrength: { value: randomRange(this.parameters.fractalStrength) },
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.rotateZ(THREE.MathUtils.degToRad(randFloat(0, 360)))
        this.mesh.position.set(wpos.x, wpos.y, wpos.z)
        // this.mesh.position.z = cameraWorldPos.z + this.parameters.distanceToCamera;
        this.scene.add(this.mesh);
    }

    update() {
        this.t += this.time.delta
        const r = this.t / this.lifetime
        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uRatio.value = r

        // console.log(r)
        // if (r > 1) {
        //     this.destroy()
        // }
    }
}
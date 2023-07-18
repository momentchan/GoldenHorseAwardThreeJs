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
        this.setupMesh(pos)
    }

    setupMesh(pos) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)
        const w = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera).w
        const size = randomRange(this.parameters.size) * MathUtils.lerp(1, 1.5, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size

        const geometry = new THREE.PlaneGeometry(size, size);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,

            uniforms: {
                uRatio: { value: 0 },
                uLightTex: { value: this.items.lightTex1 },
                uStrokeTex: { value: this.items.strokeTex },
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateZ(MathUtils.degToRad(180))
        this.mesh.position.set(wpos.x, wpos.y, wpos.z)
        this.scene.add(this.mesh);
    }

    update() {
        super.update()
        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1) {
            this.destroy()
        }
    }
}
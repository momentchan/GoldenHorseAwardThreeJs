import * as THREE from 'three'
import { MathUtils } from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/PaintShader'
import Instance from '../basis/Instance'

export default class Paint extends Instance {
    constructor(generator, id, pos, size, strength) {
        super(generator, id)
        this.setupMesh(pos, size, strength)
    }

    setupMesh(pos, size, strength) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)
        const w = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera).w
        const s = size * MathUtils.lerp(1, 1.5, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size

        const geometry = new THREE.PlaneGeometry(s, s * 0.3)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            uniforms: {
                uPaintTex: { value: this.generator.getPaintTex() },
                uColor: { value: this.isMagicHour ? new THREE.Vector3(1, 0.7, 0.7) : new THREE.Vector3(1, 1, 1) },
                uStrength: { value: strength },
                uRatio: { value: 0 },
            },
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.position.set(wpos.x, wpos.y, wpos.z)
        this.scene.add(this.mesh);
    }

    update() {
        super.update()
        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }
}
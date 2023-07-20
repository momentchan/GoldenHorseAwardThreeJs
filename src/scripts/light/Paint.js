import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/PaintShader'
import Instance from '../basis/Instance'

export default class Paint extends Instance {
    constructor(generator, id, pos, size, strength) {
        super(generator, id)
        this.setupMesh(pos)
    }

    setupMesh(pos) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)
        const w = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera).w
        const size = randomRange(this.parameters.size) * MathUtils.lerp(1, 1.5, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size

        const geometry = new THREE.PlaneGeometry(size, size)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uBackgroundTex: { value: this.isMagicHour ? this.items.backgroundRedTex : this.items.backgroundBlueTex },
                uPaintTex: { value: this.generator.getPaintTex() },
                uLightTex: { value: this.items.lightTex1 },
                uColor: { value: this.isMagicHour ? new THREE.Vector3(5, 0.2, 0.2) : new THREE.Vector3(1, 1, 1) },
                uStrength: { value: Math.random() < 0.8 ? this.parameters.strength.x : this.parameters.strength.y },
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
import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import { vertexShader } from '../../shaders/BrushShader'
import { fragmentShader } from '../../shaders/BrushShader'
import Instance from '../basis/Instance'

export default class Brush extends Instance {
    constructor(generator, id) {
        super(generator, id)
        this.setupMesh()
    }

    setupMesh() {
        const wpos = this.camera.getWorldPos()

        const { w, h } = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera)
        const size = randomRange(this.parameters.size) * MathUtils.lerp(1, 1.8, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size
        const ratio = randomRange(this.parameters.ratio)

        const geometry = new THREE.PlaneGeometry(size, size * ratio, 1, 40)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            uniforms: {
                uBackgroundTex: { value: this.isMagicHour ? this.items.backgroundRedTex : this.items.backgroundBlueTex },
                uStrokeTex: { value: this.isMagicHour ? this.items.brushRedTex : this.items.brushBlueTex },
                uDistortionFrequency: { value: randomRange(this.parameters.distortionFrequency) },
                uDistortionStrength: { value: randomRange(this.parameters.distortionStrength) },
                uStrength: { value: randomRange(this.parameters.strength) },
                uHue: { value: randomRange(this.parameters.hue) },
                uRatio: { value: 0 },
                uSeed: { value: Math.random() },
                uSpeed: { value: this.generator.isMobile? 1.5 : 3 }
            },
        })

        const pos = new THREE.Vector3((Math.random() - 0.5) * w,
                                      (Math.random() - 0.5) * h,
                                       wpos.z + this.parameters.distanceToCamera)

        const angle = Math.random() * Math.PI * 2

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.position.set(pos.x, pos.y, pos.z)

        this.scene.add(this.mesh);
    }

    update() {
        super.update()

        this.material.uniforms.uRatio.value = this.age
        this.mesh.visible = this.generator.visible

        if (this.age > 1)
            this.destroy()
    }
}
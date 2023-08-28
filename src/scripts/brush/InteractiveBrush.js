import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import { vertexShader } from '../../shaders/BrushShader'
import { fragmentShader } from '../../shaders/BrushShader'

import Instance from '../basis/Instance'

export default class InteractiveBrush extends Instance {

    constructor(generater, id, from, to, delay) {
        super(generater, id)

        this.isDelay = delay
        this.isSpawned = false


        setTimeout(() => {
            this.setupMesh(from, to)
            this.isSpawned = true
        }, this.isDelay ? randomRange(this.parameters.delay) : 0)
    }

    setupMesh(from, to) {
        const { center, direction } = this.computeCenterDirection(from, to)
        const distance = direction.length(0)

        const h = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera).h
        const ratio = distance / h

        const size = randomRange(this.parameters.size)
        const geometry = new THREE.PlaneGeometry(size, distance, 1, 50)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uBackgroundTex: { value: this.isMagicHour ? this.items.backgroundRedTex : this.items.backgroundBlueTex },
                uStrokeTex: { value: this.isMagicHour ? this.items.brushRedTex : this.items.brushBlueTex },
                uDistortionFrequency: { value: randomRange(this.parameters.distortionFrequency) },
                uDistortionStrength: { value: randomRange(this.parameters.distortionStrength) * ratio },
                uStrength: { value: randomRange(this.parameters.strength) },
                uHue: { value: randomRange(this.parameters.hue) },
                uRatio: { value: 0 },
                uSeed: { value: Math.random() },
                uSpeed: { value: this.generator.isMobile ? 5 : 10 }
            },
        })

        var angle = -Math.atan2(direction.y, direction.x)

        var offsetX = randomRange(this.parameters.offsetX)
        var offsetY = randomRange(this.parameters.offsetY)

        offsetY += this.isDelay ? Math.random(0.5, 1.0) * distance : 0

        center.addVectors(center, new THREE.Vector3(offsetX * Math.sin(angle) + offsetY * Math.cos(angle),
            offsetX * Math.cos(angle) + offsetY * Math.sin(angle),
            0))

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.rotateZ(MathUtils.degToRad(90))
        this.mesh.position.set(center.x, center.y, center.z)

        this.scene.add(this.mesh);
    }
    

    update() {
        if (!this.isSpawned)
            return
        super.update()

        this.material.uniforms.uRatio.value = this.age
        this.mesh.visible = this.generator.visible

        if (this.age > 1)
            this.destroy()
    }

    computeCenterDirection(from, to) {
        const wfrom = this.camera.getWorldPosFromNDC(from, this.parameters.distanceToCamera)
        const wto = this.camera.getWorldPosFromNDC(to, this.parameters.distanceToCamera)

        const center = new THREE.Vector3();
        center.lerpVectors(wfrom, wto, 0.5);

        const direction = new THREE.Vector3();
        direction.subVectors(wto, wfrom);

        return { center, direction }
    }
}
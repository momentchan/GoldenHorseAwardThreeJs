import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import vertexShader from '../../shaders/brushStill/vertex.glsl'
import fragmentShader from '../../shaders/brushStill/fragment.glsl'
import Instance from '../basis/Instance'

export default class Brush extends Instance {
    constructor(generator, id) {
        super(generator, id)
        this.setupMesh()
    }

    setupMesh() {
        const size = randomRange(this.parameters.size)
        const ratio = randomRange(this.parameters.ratio)
        const geometry = new THREE.PlaneGeometry(size, size * ratio, 1, 40)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uPaperTex: { value: this.items.backgroundTex },
                uStrokeTex: { value: this.items.brushStillTex },

                uDistortionFrequency: { value: randomRange(this.parameters.distortionFrequency) },
                uDistortionStrength: { value: randomRange(this.parameters.distortionStrength) },
                uStrength: { value: randomRange(this.parameters.strength) },
                uHue: { value: randomRange(this.parameters.hue) },
                uRatio: { value: 0 },
                uSeed: { value: Math.random() },
                uSpeed: { value: 3 }
            },
        })


        const cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        const sizes = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera)
        const position = new THREE.Vector3((Math.random() - 0.5) * sizes[0],
            (Math.random() - 0.5) * sizes[1],
            cameraWorldPos.z + this.parameters.distanceToCamera)

        // position.setX(0)
        // position.setY(0)
        const angle = Math.random() * Math.PI * 2

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.position.set(position.x, position.y, position.z)

        this.scene.add(this.mesh);
    }

    updateMaterial() {
        // this.material.uniforms.uDistortionFrequency.value = this.parameters.distortionFrequency
        // this.material.uniforms.uDistortionStrength.value = this.parameters.distortionStrength
        // this.material.uniforms.uStrength.value = this.parameters.strength
        this.material.uniforms.uHue.value = this.parameters.hue
        this.material.uniforms.uSaturation.value = this.parameters.saturation
        this.material.uniforms.uValue.value = this.parameters.value
    }


    update() {
        super.update()

        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }
}
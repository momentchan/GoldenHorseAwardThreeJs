import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../../three.js-gist/Utils/Helper'
import vertexShader from '../../../shaders/brushVideo/vertex.glsl'
import fragmentShader from '../../../shaders/brushVideo/fragment.glsl'
import VideoTexture from '../../../three.js-gist/Utils/VideoTexture'

export default class BrushVideo {
    constructor(generater, id) {
        this.id = id

        this.generater = generater
        this.scene = this.generater.scene
        this.camera = this.generater.camera
        this.items = this.generater.items
        this.time = this.generater.experience.time
        this.experience = this.generater.experience
        this.parameters = this.generater.parameters

        this.t = 0
        this.lifetime = randomRange(this.parameters.lifetime)

        this.videoTexture = new VideoTexture('videos/brush1.mp4')
        this.videoTexture.setSpeed(randomRange(this.parameters.speed))

        this.setupMesh()
    }


    setupMesh() {
        const size = randomRange(this.parameters.size)
        const geometry = new THREE.PlaneGeometry(0.25 * size, 1 * size, 1, 20)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uPaperTex: { value: this.items.paperTex },
                uStrokeTex: { value: this.videoTexture.texture },

                uDistortionFrequency: { value: this.parameters.distortionFrequency },
                uDistortionStrength: { value: this.parameters.distortionStrength },

                uStrength: { value: this.parameters.strength },
                uHueShift: { value: this.parameters.hueShift },
                uRatio: { value: 0 }
            },
        })


        const cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)
        const sizes = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)
        const position = new THREE.Vector3((Math.random() - 0.5) * sizes[0], (Math.random() - 0.5) * sizes[1], cameraWorldPos.z + this.generater.distanceToCamera)
        const angle = Math.random() * Math.PI * 2
        // this.position.setX(0)
        // this.position.setY(0)
        // this.angle = 0

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.position.set(position.x, position.y, position.z)

        this.scene.add(this.mesh);
    }

    updateMaterial() {
        this.material.uniforms.uDistortionFrequency.value = this.parameters.distortionFrequency
        this.material.uniforms.uDistortionStrength.value = this.parameters.distortionStrength
        this.material.uniforms.uStrength.value = this.parameters.strength
        this.material.uniforms.uHueShift.value = this.parameters.hueShift
    }


    update() {
        this.videoTexture.update()

        this.t += this.time.delta / 1000
        this.age = this.t / this.lifetime

        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }

    destroy() {
        this.generater.removeBrushFromList(this.id)
        this.scene.remove(this.mesh)
        this.mesh.geometry.dispose()
        this.mesh.material.dispose()
        this.videoTexture.destroy()

        delete this
    }
}
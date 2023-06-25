import * as THREE from 'three'
import { MathUtils } from 'three'
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

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y)

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.sizes = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)
        this.position = new THREE.Vector3((Math.random() - 0.5) * this.sizes[0], (Math.random() - 0.5) * this.sizes[1], cameraWorldPos.z + this.generater.distanceToCamera)
        // this.position.setX(0)
        // this.position.setY(0)
        this.angle = Math.random() * Math.PI * 2
        // this.angle = 0

        this.parameters = this.generater.parameters

        this.experience = this.generater.experience

        this.videoTexture = new VideoTexture('videos/brush1.mp4')

        const sizes = this.parameters.sizes
        const strength = this.parameters.strength

        const hueShift = this.parameters.hueShift
        const colorStrength = this.parameters.colorStrength

        const size = MathUtils.randFloat(sizes.x, sizes.y)
        const distortionFrequency = this.parameters.distortionFrequency
        const distortionStrength = this.parameters.distortionStrength

        const geometry = new THREE.PlaneGeometry(0.25 * size, 1 * size, 1, 10)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uDistortionFrequency: { value: distortionFrequency },
                uDistortionStrength: { value: distortionStrength },

                uColorTex: { value: this.items.backgroundTex },
                uStrokeTex: { value: this.videoTexture.texture },
                uStrength: { value: strength },
                uDrawRate: { value: 0.0 },
                uHueShift: { value: hueShift },
                uColorStrength: { value: colorStrength },
                uRatio: { value: 0 }
            },
        })

        this.mesh = new THREE.Mesh(geometry, this.material);

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(this.angle)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
        this.scene.add(this.mesh);
    }


    update() {
        this.videoTexture.update()

        this.t += this.time.delta / 1000
        this.age = this.t / this.lifetime

        this.material.uniforms.uDrawRate.value = this.t
        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }

    destroy() {
        this.generater.removeBrushFromList(this.id)
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        delete this
    }

    // updateMaterial() {
    //     this.material.uniforms.uStrength.value = this.parameters.strength
    //     this.material.uniforms.uColorStrength.value = this.parameters.colorStrength
    //     this.material.uniforms.uHueShift.value = this.parameters.hueShift
    //     this.material.uniforms.uDistortionFrequency.value = this.parameters.distortionFrequency
    //     this.material.uniforms.uDistortionStrength.value = this.parameters.distortionStrength
    //     this.material.uniforms.uCount.value = this.parameters.count
    //     this.material.uniforms.uWitdh.value = this.parameters.width
    //     this.material.uniforms.uHeight.value = this.parameters.height
    // }
}
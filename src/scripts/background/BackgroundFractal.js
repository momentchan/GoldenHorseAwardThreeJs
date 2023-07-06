import * as THREE from 'three'

import screenVertexShader from '../../shaders/screen_vertex.glsl'
import backgroundFractalFragmentShader from '../../shaders/backgroundFractal/fragment.glsl'

export default class BackgroundFractal {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.audio = this.experience.audio
        this.cameraGroup = this.camera.cameraGroup

        this.sizes = this.experience.sizes
        this.audioStrength = 0

        const { w, h } = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))
        const geometry = new THREE.PlaneGeometry(w, h, 1, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: screenVertexShader,
            fragmentShader: backgroundFractalFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.0001 },
                uTexture: { value: this.experience.resources.items.backgroundTex },
                uAudioStrength: { value: 0 }
            }
        })
        this.mesh = new THREE.Mesh(geometry, this.material)
        this.cameraGroup.add(this.mesh)

        this.sizes.on('resize', () => {
            this.resize()
        })
    }

    resize() {
        const { w, h } = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))
        this.mesh.scale.set(w, h, 1);
    }

    update() {
        this.material.uniforms.uTime.value = this.experience.time.elapsed
        this.audioStrength = THREE.MathUtils.lerp(this.audioStrength, this.audio.getIntensity(), 0.5)
        this.material.uniforms.uAudioStrength.value = this.audioStrength
        // console.log(this.audioStrength);
    }
}
import * as THREE from 'three'

import vertex from '../../three.js-gist/Shader/ScreenVertex.js'
import fragment from '../../shaders/BackgroundFractalShader.js'

export default class BackgroundFractal {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.audio = this.experience.audio
        this.items = this.experience.resources.items
        this.isNight = this.experience.isNight
        this.cameraGroup = this.camera.cameraGroup

        this.sizes = this.experience.sizes

        const { w, h } = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))
        const geometry = new THREE.PlaneGeometry(w, h, 1, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.0001 },
                uTexture: { value: this.isNight? this.items.backgroundRedTex : this.items.backgroundBlueTex },
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
    }
}
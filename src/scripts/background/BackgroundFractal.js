import * as THREE from 'three'

import screenVertexShader from '../../shaders/screen_vertex.glsl'
import backgroundFractalFragmentShader from '../../shaders/backgroundFractal/fragment.glsl'

export default class BackgroundFractal {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.cameraGroup = this.camera.cameraGroup

        const size = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))

        const geometry = new THREE.PlaneGeometry(size[0], size[1], 1, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: screenVertexShader,
            fragmentShader: backgroundFractalFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.0001 },
                uTexture: { value: this.experience.resources.items.backgroundTex }
            }
        })
        const plane = new THREE.Mesh(geometry, this.material)
        this.cameraGroup.add(plane)
    }

    update() {
        this.material.uniforms.uTime.value = this.experience.time.elapsed
    }
}
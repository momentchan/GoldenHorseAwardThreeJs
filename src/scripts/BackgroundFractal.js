import * as THREE from 'three'
import backgroundFractalVertexShader from '../shaders/backgroundFractal/vertex.glsl'
import backgroundFractalFragmentShader from '../shaders/backgroundFractal/fragment.glsl'

export default class BackgroundFractal {

    constructor(experience) {
        this.experience = experience

        const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

        this.material = new THREE.ShaderMaterial({
            vertexShader: backgroundFractalVertexShader,
            fragmentShader: backgroundFractalFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uSpeed : {value: 0.0001},
                uTexture: { value: this.experience.resources.items.backgroundTex }
            }
        })
        const plane = new THREE.Mesh(geometry, this.material);
        this.experience.scene.add(plane);
    }

    update() {
        this.material.uniforms.uTime.value = this.experience.time.elapsed
    }
}
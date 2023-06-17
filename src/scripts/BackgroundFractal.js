import * as THREE from 'three'
import backgroundFractalVertexShader from '../shaders/backgroundFractal/vertex.glsl'
import backgroundFractalFragmentShader from '../shaders/backgroundFractal/fragment.glsl'

export default class BackgroundFractal {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.cameraGroup = this.camera.cameraGroup

        var fovRadians = THREE.MathUtils.degToRad(this.camera.instance.fov);
        var d = Math.abs(this.camera.instance.position.z)
        var h = 2 * Math.tan(fovRadians * 0.5) * d;
        var w = h * this.camera.instance.aspect;

        const geometry = new THREE.PlaneGeometry(w, h, 32, 32);

        this.material = new THREE.ShaderMaterial({
            vertexShader: backgroundFractalVertexShader,
            fragmentShader: backgroundFractalFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
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
import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/LogoShader.js'
import { MathUtils } from 'three'

export default class LogoPng {

    constructor(experience) {
        this.experience = experience
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.items = this.experience.resources.items
        this.isMagicHour = this.experience.isMagicHour
        this.cameraGroup = this.camera.cameraGroup
        this.sizes = this.experience.sizes
        this.t = 0
        this.lifetime = 5000

        this.distance = 0.5
        const { w, h } = this.camera.getWorldSizeAtDistance(this.distance)

        this.s = [0.2, 0.45]
        this.y = [0.3, -0.28]

        this.logoUp = this.createLogo(this.items.logoTopTex, this.s[0] * h, this.y[0] * h)
        // this.logoBottom = this.createLogo(this.items.logoBottomTex, this.s[1] * h, this.y[1] * h)
    }

    createLogo(tex, size, y) {
        const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            uniforms: {
                uTexture: { value: tex },
                uRatio: { value: 0 },
            },
        });

        const mesh = new THREE.Mesh(geometry, this.material)
        mesh.rotateY(MathUtils.degToRad(180))
        mesh.scale.set(size, size, 1)
        this.cameraGroup.add(mesh)
        mesh.position.set(0, y, this.camera.getWorldPos().z + this.distance)
        return mesh
    }

    update() {
        this.t += this.time.delta
        this.material.uniforms.uRatio.value = this.t / this.lifetime
    }
}
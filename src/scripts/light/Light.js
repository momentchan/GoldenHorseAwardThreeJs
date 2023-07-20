import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/LightShader.js'
import Instance from '../basis/Instance'
import { MathUtils } from 'three'


export default class Light extends Instance {
    constructor(generator, id, pos, size, strength, dir) {
        super(generator, id)
        this.setupMesh(pos, size, strength, dir)
    }

    setupMesh(pos, size, strength, dir) {
        const wpos = this.camera.getWorldPosFromNDC(pos, this.parameters.distanceToCamera)
        const w = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera).w
        const s = size * MathUtils.lerp(1, 1.5, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size

        const geometry = new THREE.PlaneGeometry(s, s * 0.3);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            uniforms: {
                uLightTex: { value: this.items.lightTex },
                uColor: { value: this.parameters.color },
                uStrength: { value: strength },
                uRatio: { value: 0 },
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))

        if (dir == -1)
            this.mesh.rotateZ(MathUtils.degToRad(180))
            
        this.mesh.position.set(wpos.x, wpos.y, wpos.z)
        this.scene.add(this.mesh);
    }

    update() {
        super.update()
        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1) {
            this.destroy()
        }
    }
}
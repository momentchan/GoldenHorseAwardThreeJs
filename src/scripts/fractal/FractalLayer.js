import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/FractalLayerShader.js'
import Instance from '../basis/Instance'

import { MathUtils } from 'three'

export default class FractalLayer extends Instance {
    constructor(generator, id) {
        super(generator, id)
        this.setupMesh()
    }

    setupMesh() {
        const { w, h } = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera)
        const geometry = new THREE.PlaneGeometry(w * 1.5, h * 1.5);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            precision: 'lowp',
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: this.parameters.speed },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uBackgroundTex: { value: this.isMagicHour ? this.items.backgroundRedTex : this.items.backgroundBlueTex },
                uWtoH: { value: w / h }
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.position.z = this.camera.getWorldPos().z + this.parameters.distanceToCamera;
        this.scene.add(this.mesh);
    }

    update() {
        super.update()
        this.material.uniforms.uTime.value = this.t / 1000
        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1) {
            this.destroy()
        }
    }
}
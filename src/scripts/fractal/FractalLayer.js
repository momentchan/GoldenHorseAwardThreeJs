import * as THREE from 'three'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/FractalLayerShader.js'
import Instance from '../basis/Instance'

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
            side: THREE.DoubleSide,
            transparent: true,

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

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.position.z = cameraWorldPos.z + this.parameters.distanceToCamera;
        this.scene.add(this.mesh);
    }

    update() {
        this.t += this.time.delta
        const r = this.t / this.lifetime
        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uRatio.value = r

        // console.log(r)
        if (r > 1) {
            this.destroy()
        }
    }
}
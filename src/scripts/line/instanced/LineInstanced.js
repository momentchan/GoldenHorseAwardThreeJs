import * as THREE from 'three'
import { MathUtils } from 'three'
import vertexShader from '../../../shaders/lineInstanced/instanced_vertex_instanced.glsl'
import fragmentShader from '../../../shaders/lineInstanced/fragment.glsl'
import Instance from '../../basis/Instance'


export default class LineInstanced extends Instance {
    setupMesh() {
        const position = new THREE.Vector3(0, 0, 0)
        const geometry = new THREE.PlaneGeometry(1, 1, 100, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uRatio: { value: 0 },
                uBackgroundTex: { value: this.items.backgroundTex },
                uFractalTex: { value: this.generater.lineFractal.getTexture() }
            }
        })

        const count = this.parameters.count
        const wRange = this.parameters.wRange
        const hRange = this.parameters.hRange

        this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
        this.camera.cameraGroup.add(this.mesh)

        const seedBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
        this.mesh.geometry.setAttribute('seedBuffer', seedBuffer)

        for (let i = 0; i < count; i++) {

            const w = MathUtils.randFloat(wRange.x, wRange.y)
            const h = MathUtils.randFloat(hRange.x, hRange.y)
            const angle = MathUtils.degToRad(MathUtils.randFloat(0, 2));

            const p = position.clone()
                .add(new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 5,
                    0
                ))

            const q = new THREE.Quaternion()
            q.setFromEuler(new THREE.Euler(0, Math.PI, angle))

            const matrix = new THREE.Matrix4()

            matrix.compose(p, q, new THREE.Vector3(w, h, 1.0))

            this.mesh.setMatrixAt(i, matrix)
            seedBuffer.setX(i, Math.random())
        }
    }

    update() {
        super.update()
        this.material.uniforms.uTime.value = this.t / 1000
        this.material.uniforms.uRatio.value = this.age
    }
}
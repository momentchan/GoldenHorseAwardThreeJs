import * as THREE from 'three'
import { MathUtils } from 'three'
import vertexShader from '../../shaders/lineInstanced/instanced_vertex_instanced.glsl'
import fragmentShader from '../../shaders/lineInstanced/fragment.glsl'
import Instance from '../basis/Instance'


export default class Line extends Instance {
    constructor(generator, id) {
        super(generator, id)

        this.setupMesh()
    }

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
                uFractalTex: { value: this.generator.fractalMask.getTexture() },
            }
        })

        this.count = this.parameters.count
        const wRange = this.parameters.wRange
        const hRange = this.parameters.hRange

        this.mesh = new THREE.InstancedMesh(geometry, this.material, this.count)
        this.camera.cameraGroup.add(this.mesh)

        const seedBuffer = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.mesh.geometry.setAttribute('seedBuffer', seedBuffer)
        const { w, h } = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))

        for (let i = 0; i < this.count; i++) {

            const seed = Math.random()
            const length = MathUtils.lerp(wRange.x, wRange.y, seed * 1.23 % 1)
            const thickness = MathUtils.lerp(hRange.x, hRange.y, seed * 4.56 % 1)
            const angle = MathUtils.degToRad(MathUtils.lerp(-2, 2, seed * 7.89 % 1));

            const p = position.clone()
                .add(new THREE.Vector3(
                    (seed * 12.34 % 1 - 0.5) * w,
                    (seed * 34.5 % 1 - 0.5) * h,
                    0
                ))

            const q = new THREE.Quaternion()
            q.setFromEuler(new THREE.Euler(0, Math.PI, angle))

            const matrix = new THREE.Matrix4()

            matrix.compose(p, q, new THREE.Vector3(length, thickness, 1.0))

            this.mesh.setMatrixAt(i, matrix)
            seedBuffer.setX(i, seed)
        }

    }


    resize() {
        const position = new THREE.Vector3(0, 0, 0)
        const { w, h } = this.camera.getWorldSizeAtDistance(Math.abs(this.camera.instance.position.z))

        const seedBuffer = this.mesh.geometry.getAttribute('seedBuffer')
        for (let i = 0; i < this.count; i++) {

            const seed = seedBuffer.getX(i)
            const matrix = new THREE.Matrix4()
            this.mesh.getMatrixAt(i, matrix)
            const p = position.clone()
                .add(new THREE.Vector3(
                    (seed * 12.34 % 1 - 0.5) * w,
                    (seed * 34.5 % 1 - 0.5) * h,
                    0
                ))

            matrix.setPosition(p)
            this.mesh.setMatrixAt(i, matrix)
            this.mesh.updateMatrix()
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    update() {
        super.update()
        this.material.uniforms.uTime.value = this.t / 1000
        this.material.uniforms.uRatio.value = this.age
    }
}
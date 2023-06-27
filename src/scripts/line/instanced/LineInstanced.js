import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushLayerInstanced from './BrushLayerInstanced'
import instancedVertexShader from '../../../shaders/lineInstanced/instanced_vertex_instanced.glsl'
import brushFragmentShader from '../../../shaders/lineInstanced/fragment.glsl'
import { randFloat } from 'three/src/math/MathUtils'


export default class LineInstanced {
    constructor(generater, id) {
        this.id = id

        this.type = 'bottom'

        this.generater = generater
        this.scene = this.generater.scene
        this.camera = this.generater.camera
        this.items = this.generater.items

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y) * 1000

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.sizes = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)

        this.position = new THREE.Vector3(0, 0, 0)
        this.angle = Math.PI * 0.0

        this.parameters = this.generater.parameters

        this.brushSize = new THREE.Vector2(0.4, 2)

        const geometry = new THREE.PlaneGeometry(1, 1, 100, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: instancedVertexShader,
            fragmentShader: brushFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.00002 },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uStrength: { value: this.parameters[this.type].strength },
                uColorStrength: { value: this.parameters[this.type].colorStrength },
                uHueShift: { value: this.parameters[this.type].hueShift },
                uStrokeTex: { value: this.items.strokeTex },
                uPaperTex: { value: this.items.paperTex },
                uNoiseTex: { value: this.items.noiseTex },
                uBackgroundTex: { value: this.items.backgroundTex }
            }
        })

        const count = this.parameters[this.type].count
        const wRange = new THREE.Vector2(0.5, 1).multiplyScalar(2.5)
        const hRange = new THREE.Vector2(0.3, 0.5).multiplyScalar(0.01)

        this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
        const seedBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
        this.mesh.geometry.setAttribute('seedBuffer', seedBuffer)
        this.mesh.rotateZ(this.angle)

        this.camera.cameraGroup.add(this.mesh)

        for (let i = 0; i < count; i++) {

            const w = MathUtils.randFloat(wRange.x, wRange.y)
            const h = MathUtils.randFloat(hRange.x, hRange.y)
            const angle = MathUtils.degToRad(MathUtils.randFloat(0, 2));

            const x = Math.random()
            const y = Math.random()

            const position = this.position.clone()
                .add(new THREE.Vector3(
                    (x - 0.5) * 2,
                    (y - 0.5) * 5,
                    0
                ))

            const quaternion = new THREE.Quaternion()
            quaternion.setFromEuler(new THREE.Euler(0, Math.PI, angle))

            const matrix = new THREE.Matrix4()

            matrix.compose(position, quaternion, new THREE.Vector3(w, h, 1.0))

            this.mesh.setMatrixAt(i, matrix)
            seedBuffer.setX(i, Math.random())
        }
    }


    update() {
        this.t += this.time.delta
        this.age = this.t / this.lifetime
        this.material.uniforms.uTime.value = this.t / 1000
        this.material.uniforms.uRatio.value = this.age

        if (this.upperLayer)
            this.upperLayer.update()
        if (this.bottomLayer)
            this.bottomLayer.update()

        // if (this.age > 1)
        //     this.destroy()
    }

    updateMaterials() {
        this.upperLayer.updateMaterial()
        this.bottomLayer.updateMaterial()
    }

    destroy() {
        this.generater.removeBrushFromList(this.id)

        if (this.upperLayer)
            this.upperLayer.destroy()
        if (this.bottomLayer)
            this.bottomLayer.destroy()

        delete this
    }
}
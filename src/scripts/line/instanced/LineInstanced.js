import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushLayerInstanced from './BrushLayerInstanced'
import instancedVertexShader from '../../../shaders/lineInstanced/instanced_vertex_instanced.glsl'
import brushFragmentShader from '../../../shaders/lineInstanced/fragment.glsl'


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

        this.position = new THREE.Vector3((Math.random() - 0.5) * this.sizes[0], (Math.random() - 0.5) * this.sizes[1], cameraWorldPos.z + this.generater.distanceToCamera)
        this.position = new THREE.Vector3(0, 0, cameraWorldPos.z + this.generater.distanceToCamera)
        this.angle = Math.PI * 0.


        this.parameters = this.generater.parameters

        this.brushSize = new THREE.Vector2(0.4, 2)

        // this.bottomLayer = new BrushLayerInstanced(this, 'bottom')

        // this.upperLayer = new BrushLayerInstanced(this, 'upper')



        const geometry = new THREE.PlaneGeometry(1, 1, 100, 1);

        this.material = new THREE.ShaderMaterial({
            vertexShader: instancedVertexShader,
            fragmentShader: brushFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            // blending: THREE.AdditiveBlending,
            // wireframe: true,
            // blending: THREE.AdditiveBlending,
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
                uBackgroundTex: { value: this.items.backgroundTex }
            }
        })

        const count = this.parameters[this.type].count
        const wRange = new THREE.Vector2(0.5, 1).multiplyScalar(0.5)
        const hRange = new THREE.Vector2(0.3, 1).multiplyScalar(0.005)

        this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
        const seedBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
        const uvBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);

        this.mesh.geometry.setAttribute('seedBuffer', seedBuffer)
        this.mesh.geometry.setAttribute('uvBuffer', uvBuffer) // x0, x1, y0, y1
        this.mesh.rotateZ(this.angle)

        // var rotationMatrix = new THREE.Matrix4().makeRotationZ(this.angle)
        // this.mesh.applyMatrix4(rotationMatrix)
        // this.mesh.rotateY(MathUtils.degToRad(180))

        this.scene.add(this.mesh)

        for (let i = 0; i < count; i++) {

            const w = MathUtils.randFloat(wRange.x, wRange.y)
            const h = MathUtils.randFloat(hRange.x, hRange.y)

            const x = Math.random()
            const y = Math.random()

            const position = this.position.clone()
                .add(new THREE.Vector3(
                    (x - 0.5) * this.brushSize.x,
                    (y - 0.5) * 0.5,
                    0
                ))

            const quaternion = new THREE.Quaternion()
            quaternion.setFromEuler(new THREE.Euler(0, Math.PI , 0))

            const matrix = new THREE.Matrix4()

            matrix.compose(position, quaternion, new THREE.Vector3(w, h, 1.0))

            this.mesh.setMatrixAt(i, matrix)
            seedBuffer.setX(i, Math.random())
            uvBuffer.setX(i, x - w / this.brushSize.x * 0.5)
            uvBuffer.setY(i, x + w / this.brushSize.x * 0.5)
            uvBuffer.setZ(i, 0.5 - h / this.brushSize.y * 0.5)
            uvBuffer.setW(i, 0.5 + h / this.brushSize.y * 0.5)
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
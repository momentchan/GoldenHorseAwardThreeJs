import * as THREE from 'three'
import { MathUtils } from 'three'
import screenVertexShader from '../shaders/screen_vertex.glsl'
import instancedVertexShader from '../shaders/instanced_vertex.glsl'
import brushFragmentShader from '../shaders/brush/fragment.glsl'

export default class BrushLayer {
    constructor(brush, count, wRange, hRange, strength, colorStrength, hueShift) {
        this.brush = brush
        this.scene = this.brush.scene
        this.camera = this.brush.camera
        this.items = this.brush.items
        const geometry = new THREE.PlaneGeometry(1, this.brush.brushSize.y, 1, 10);

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
                uStrength: { value: strength },
                uColorStrength: { value: colorStrength },
                uStrokeTex: { value: this.items.strokeTex },
                uBackgroundTex: { value: this.items.backgroundTex },
                uHueShift: { value: hueShift }
            }
        })

        this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
        const seedBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
        const uvBuffer = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);

        this.mesh.geometry.setAttribute('seedBuffer', seedBuffer)
        this.mesh.geometry.setAttribute('uvBuffer', uvBuffer) // x0, x1, y0, y1

        var rotationMatrix = new THREE.Matrix4().makeRotationZ(this.brush.angle)
        this.mesh.applyMatrix4(rotationMatrix)

        this.scene.add(this.mesh)

        for (let i = 0; i < count; i++) {

            const w = MathUtils.randFloat(wRange.x, wRange.y)
            const h = MathUtils.randFloat(hRange.x, hRange.y)

            const x = Math.random()
            const y = Math.random()

            const position = this.brush.position.clone()
                .add(new THREE.Vector3(
                    (x - 0.5) * this.brush.brushSize.x,
                    0,
                    0
                ))

            const quaternion = new THREE.Quaternion()
            quaternion.setFromEuler(new THREE.Euler(0, 0, 0))

            const matrix = new THREE.Matrix4()

            matrix.compose(position, quaternion, new THREE.Vector3(w, h, 1.0))

            this.mesh.setMatrixAt(i, matrix)
            seedBuffer.setX(i, Math.random())
            uvBuffer.setX(i, x - w / this.brush.brushSize.x * 0.5)
            uvBuffer.setY(i, x + w / this.brush.brushSize.x * 0.5)
            uvBuffer.setZ(i, 0.5 - h / this.brush.brushSize.y * 0.5)
            uvBuffer.setW(i, 0.5 + h / this.brush.brushSize.y * 0.5)
        }
    }

    update() {
        this.material.uniforms.uTime.value = this.brush.t / 1000
        this.material.uniforms.uRatio.value = this.brush.age
    }

    destroy() {
        this.scene.remove(this.mesh);

        // Dispose the plane's geometry and material
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        delete this
    }
}
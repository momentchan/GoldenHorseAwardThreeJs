import * as THREE from 'three'
import { MathUtils } from 'three'
import instancedVertexShader from '../shaders/instanced_vertex.glsl'
import brushFragmentShader from '../shaders/brush/fragment.glsl'
import BrushLayer from './BrushLayer'

export default class Brush {
    constructor(generater, id) {
        this.id = id

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

        this.position = new THREE.Vector3((Math.random()-0.5) * this.sizes[0], (Math.random()-0.5) * this.sizes[1], cameraWorldPos.z + this.generater.distanceToCamera)
        this.angle = Math.random() * Math.PI * 2

        this.brushSize = new THREE.Vector2(0.4, 2)

        this.bottomLayer = new BrushLayer(
            this,
            100,
            new THREE.Vector2(0.5, 1.5).multiplyScalar(0.1),
            new THREE.Vector2(0.3, 1),
            0.01,
            64
        )

        this.upperLayer = new BrushLayer(
            this,
            800,
            new THREE.Vector2(0.5, 1.5).multiplyScalar(0.001),
            new THREE.Vector2(0.3, 1),
            0.3,
            30
        )
    }

    update() {
        this.t += this.time.delta
        this.age = this.t / this.lifetime

        if (this.upperLayer)
            this.upperLayer.update()
        if (this.bottomLayer)
            this.bottomLayer.update()

        if (this.age > 1)
            this.destroy()
    }

    destroy() {
        this.generater.removeBrushFromList(this.id)

        this.upperLayer.destroy()
        this.bottomLayer.destroy()

        delete this
    }
}
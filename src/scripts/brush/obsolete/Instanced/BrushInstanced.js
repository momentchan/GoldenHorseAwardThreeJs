import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushLayerInstanced from './BrushLayerInstanced'

export default class BrushInstanced {
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

        const { w, h } = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)

        this.position = new THREE.Vector3((Math.random() - 0.5) * w, (Math.random() - 0.5) * h, cameraWorldPos.z + this.generater.distanceToCamera)
        this.position = new THREE.Vector3(0, 0, cameraWorldPos.z + this.generater.distanceToCamera)
        this.angle = Math.random() * Math.PI * 2


        this.parameters = this.generater.parameters

        this.brushSize = new THREE.Vector2(0.4, 2)

        this.bottomLayer = new BrushLayerInstanced(this, 'bottom')

        this.upperLayer = new BrushLayerInstanced(this, 'upper')
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
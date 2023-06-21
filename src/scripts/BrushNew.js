import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushLayerNew from './BrushLayerNew'

export default class BrushNew {
    constructor(generater, id) {
        this.id = id

        this.generater = generater
        this.scene = this.generater.scene
        this.camera = this.generater.camera
        this.items = this.generater.items

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y)

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.sizes = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)
        this.position = new THREE.Vector3((Math.random() - 0.5) * this.sizes[0], (Math.random() - 0.5) * this.sizes[1], cameraWorldPos.z + this.generater.distanceToCamera)
        this.position.setX(0)
        this.position.setY(0)
        this.angle = Math.random() * Math.PI * 2

        this.parameters = this.generater.parameters

        this.bottomLayer = new BrushLayerNew(this, 'bottom')
        this.upperLayer = new BrushLayerNew(this, 'upper')
    }


    update() {
        this.t += this.time.delta / 1000
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
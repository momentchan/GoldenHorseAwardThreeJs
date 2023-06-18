import * as THREE from 'three'
import { MathUtils } from 'three'
import FractalLayer from './FractalLayer'

export default class FractalLayerGenerator {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.distanceToCamera = 1
        this.lifetime = new THREE.Vector2(20, 30)
        this.generateInterval = new THREE.Vector2(3, 5)

        this.layers = []
        this.layerId = 0

        this.generateLayer()
        this.startGenerateLayers()
    }

    startGenerateLayers() {
        const interval = MathUtils.randFloat(this.generateInterval.x, this.generateInterval.y) * 1000
        setTimeout(() => {
            this.generateLayer()
            this.startGenerateLayers()
        }, interval);
    };

    generateLayer() {
        const layer = new FractalLayer(this, this.layerId)
        this.layers.push(layer)
        this.layerId++
    }

    update() {
        for (var layer of this.layers) {
            layer.update()
        }
    }

    removeLayerFromList(id) {
        // console.log(id);
        this.layers = this.layers.filter(item => item.id !== id)
    }
}
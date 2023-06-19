import * as THREE from 'three'
import Brush from "./Brush"


export default class BushGenerator {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.distanceToCamera = 6
        this.lifetime = new THREE.Vector2(20, 30)
        this.generateInterval = new THREE.Vector2(3, 5)

        this.brushes = []
        this.brushId = 0

        this.generateBrush()
        // this.startGenerateBrushes()
    }

    startGenerateBrushes() {
        const interval = MathUtils.randFloat(this.generateInterval.x, this.generateInterval.y) * 1000
        setTimeout(() => {
            this.generateBrush()
            this.startGenerateBrushes()
        }, interval);
    };

    generateBrush() {
        const brush = new Brush(this, this.brushId)
        this.brushes.push(brush)
        this.brushId++
    }

    update() {
        // for (var layer of this.layers) {
        //     layer.update()
        // }
    }

    removeLayerFromList(id) {
        // console.log(id);
        // this.layers = this.layers.filter(item => item.id !== id)
    }
}
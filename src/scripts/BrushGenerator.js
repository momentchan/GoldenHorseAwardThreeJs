import * as THREE from 'three'
import { MathUtils } from 'three'
import Brush from "./Brush"


export default class BushGenerator {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.items = this.experience.resources.items

        this.distanceToCamera = 4
        this.lifetime = new THREE.Vector2(20, 30)
        this.generateInterval = new THREE.Vector2(10, 20)

        this.brushes = []
        this.brushId = 0

        this.generateBrush()
        this.startGenerateBrushes()
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
        for (var brush of this.brushes) {
            brush.update()
        }
    }

    removeBrushFromList(id) {
        // console.log(id);
        this.brushes = this.brushes.filter(item => item.id !== id)
    }
}
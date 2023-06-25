import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushVideo from "./BrushVideo"
import { randomRange } from '../../../three.js-gist/Utils/Helper'


export default class BrushGeneratorVideo {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.items = this.experience.resources.items

        this.distanceToCamera = 1


        this.brushes = []
        this.brushId = 0

        this.setupDebug()
        this.generateBrush()
        this.startGenerateBrushes()
    }

    setupDebug() {
        this.parameters = {}

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(10, 20)
        this.parameters.size = new THREE.Vector2(0.3, 0.4)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = 0.5
        this.parameters.distortionStrength = 0.05
        this.parameters.strength = 0.2
        this.parameters.hueShift = -5

        this.debug = this.experience.debug
        // Debug
        if (this.debug.active) {

            this.folder = this.debug.ui.addFolder('brush')
            this.folder.add(this.parameters, 'distortionFrequency')
                .name('distortionFrequency')
                .min(0)
                .max(2)
                .step(0.01)
                .onChange(() => this.updateBrushMaterials())

            this.folder.add(this.parameters, 'distortionStrength')
                .name('distortionStrength')
                .min(0)
                .max(2)
                .step(0.01)
                .onChange(() => this.updateBrushMaterials())

            this.folder.add(this.parameters, 'strength')
                .name('strength')
                .min(0)
                .max(2)
                .step(0.01)
                .onChange(() => this.updateBrushMaterials())

            this.folder.add(this.parameters, 'hueShift')
                .name('hueShift')
                .min(0)
                .max(2)
                .step(0.01)
                .onChange(() => this.updateBrushMaterials())
        }
    }


    updateBrushMaterials() {
        for (var brush of this.brushes) {
            brush.updateMaterial()
        }
    }

    startGenerateBrushes() {
        const interval = randomRange(this.parameters.generateInterval) * 1000
        setTimeout(() => {
            this.generateBrush()
            this.startGenerateBrushes()
        }, interval);
    };

    generateBrush() {
        const brush = new BrushVideo(this, this.brushId)
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
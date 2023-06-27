import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushTiling from "./BrushTiling"


export default class BrushGeneratorTiling {

    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.items = this.experience.resources.items

        this.distanceToCamera = 1
        this.lifetime = new THREE.Vector2(20, 30)
        this.generateInterval = new THREE.Vector2(10, 20)

        this.brushes = []
        this.brushId = 0

        this.setupDebug()
        this.generateBrush()
        this.startGenerateBrushes()
    }

    setupDebug() {

        this.parameters = { 'bottom': {}, 'upper': {} }

        this.parameters['bottom'].sizes = new THREE.Vector2(0.3, 0.4)
        this.parameters['bottom'].distortionFrequency = 0.5
        this.parameters['bottom'].distortionStrength = 0.1
        this.parameters['bottom'].count = 3
        this.parameters['bottom'].layer = 5
        this.parameters['bottom'].strength = 2.0
        this.parameters['bottom'].width = 0.9
        this.parameters['bottom'].height = 1
        this.parameters['bottom'].colorStrength = 4.3
        this.parameters['bottom'].hueShift = -5

        this.parameters['upper'].sizes = new THREE.Vector2(0.3, 0.4)
        this.parameters['upper'].distortionFrequency = 0.5
        this.parameters['upper'].distortionStrength = 0.1
        this.parameters['upper'].count = 80
        this.parameters['upper'].layer = 3
        this.parameters['upper'].strength = 2.0
        this.parameters['upper'].width = 0.6
        this.parameters['upper'].height = 1
        this.parameters['upper'].colorStrength = 5
        this.parameters['upper'].hueShift = -30


        this.debug = this.experience.debug
        // Debug
        if (this.debug.active) {

            for (var key in this.parameters) {
                this.debugFolder = this.debug.ui.addFolder(key)
                this.debugFolder.add(this.parameters[key], 'distortionFrequency')
                    .name('distortionFrequency')
                    .min(0)
                    .max(5)
                    .step(0.01)
                    .onChange(() => this.updateBrushMaterials())

                this.debugFolder.add(this.parameters[key], 'distortionStrength')
                    .name('distortionStrength')
                    .min(0)
                    .max(5)
                    .step(0.01)
                    .onChange(() => this.updateBrushMaterials())

                this.debugFolder.add(this.parameters[key], 'strength')
                    .name('strength')
                    .min(0)
                    .max(5)
                    .step(0.001)
                    .onChange(() => this.updateBrushMaterials())

                this.debugFolder.add(this.parameters[key], 'colorStrength')
                    .name('colorStrength')
                    .min(0)
                    .max(50)
                    .step(0.01)
                    .onChange(() => this.updateBrushMaterials())

                this.debugFolder.add(this.parameters[key], 'hueShift')
                    .name('hueShift')
                    .min(-180)
                    .max(180)
                    .step(0.01)
                    .onChange(() => this.updateBrushMaterials())


                this.debugFolder.add(this.parameters[key], 'width')
                    .name('width')
                    .min(0)
                    .max(10)
                    .step(0.1)
                    .onChange(() => this.updateBrushMaterials())


                this.debugFolder.add(this.parameters[key], 'height')
                    .name('height')
                    .min(0)
                    .max(2)
                    .step(0.01)
                    .onChange(() => this.updateBrushMaterials())

                this.debugFolder.add(this.parameters[key], 'count')
                    .name('count')
                    .min(0)
                    .max(100)
                    .step(1)
                    .onChange(() => this.updateBrushMaterials())
            }
        }
    }




    updateBrushMaterials() {
        for (var brush of this.brushes) {
            brush.updateMaterials()
        }
    }


    startGenerateBrushes() {
        const interval = MathUtils.randFloat(this.generateInterval.x, this.generateInterval.y) * 1000
        setTimeout(() => {
            this.generateBrush()
            this.startGenerateBrushes()
        }, interval);
    };

    generateBrush() {
        const brush = new BrushTiling(this, this.brushId)
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
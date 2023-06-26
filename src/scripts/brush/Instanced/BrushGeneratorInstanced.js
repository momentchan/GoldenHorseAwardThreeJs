import * as THREE from 'three'
import { MathUtils } from 'three'
import BrushInstanced from "./BrushInstanced"


export default class BushGeneratorInstanced {

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

        this.setupDebug()
        this.generateBrush()
        this.startGenerateBrushes()
    }

    setupDebug() {

        this.parameters = { 'bottom': {}, 'upper': {} }
        this.parameters['bottom'].count = 200
        this.parameters['bottom'].widthScaler = 0.1
        this.parameters['bottom'].strength = 0.01
        this.parameters['bottom'].colorStrength = 15
        this.parameters['bottom'].hueShift = -2

        this.parameters['upper'].count = 800
        this.parameters['upper'].widthScaler = 0.005,
        this.parameters['upper'].strength = 0.02
        this.parameters['upper'].colorStrength = 3.8
        this.parameters['upper'].hueShift = -30

        this.debug = this.experience.debug
        // Debug
        if (this.debug.active) {
            for (var key in this.parameters) {
                this.debugFolder = this.debug.ui.addFolder(key)
                this.debugFolder.add(this.parameters[key], 'strength')
                    .name('strength')
                    .min(0)
                    .max(0.1)
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

                this.debugFolder.add(this.parameters[key], 'count')
                    .name('count')

                this.debugFolder.add(this.parameters[key], 'widthScaler')
                    .name('widthScaler')
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
        const brush = new BrushInstanced(this, this.brushId)
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
import * as THREE from 'three'
import BrushStill from "./BrushStill"
import Generator from '../../basis/Generator'


export default class BrushStillGenerator extends Generator {

    constructor(experience) {
        super(experience)

        this.setupDebug()
        this.generateInstance()
        this.startGenerateInstances()
    }
    
    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(5, 10)
        this.parameters.size = new THREE.Vector2(0.5, 0.6)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = 1.0
        this.parameters.distortionStrength = 0.1
        this.parameters.strength = 0.2
        this.parameters.hueShift = -5
    }

    getInstance() {
        return new BrushStill(this, this.brushId)
    }
    setupDebug() {
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
}
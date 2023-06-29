import * as THREE from 'three'
import BrushStill from "./BrushStill"
import Generator from '../../basis/Generator'


export default class BrushStillGenerator extends Generator {

    constructor(experience) {
        super(experience)

        this.setupDebug()
        this.addInstance()
        this.startGenerateInstances()
    }
    
    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(2, 5)
        this.parameters.size = new THREE.Vector2(0.4, 0.5)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = new THREE.Vector2(0.5, 1)
        this.parameters.distortionStrength = new THREE.Vector2(0.1, 0.3)
        this.parameters.strength = new THREE.Vector2(0.2, 0.5)
        this.parameters.hueShift = -5
    }

    getInstance(id) {
        return new BrushStill(this, id)
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
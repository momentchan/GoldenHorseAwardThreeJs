import * as THREE from 'three'
import Brush from "./Brush"
import InteractiveBrush from './InteractiveBrush'
import Generator from '../basis/Generator'

export default class BrushGenerator extends Generator {
    constructor(experience) {
        super(experience)

        this.setupDebug()
        this.addInstance()
        this.startGenerateInstances()

        this.touch = this.experience.touch

        this.touch.on('touchend', () => {
            this.addInteractiveBrush(this.touch.touches, 5)
        })
    }

    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(2, 5)
        this.parameters.ratio = new THREE.Vector2(1, 5)
        this.parameters.size = new THREE.Vector2(0.08, 0.16)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = new THREE.Vector2(3.0, 5.0)
        this.parameters.distortionStrength = new THREE.Vector2(0.01, 0.03)

        this.parameters.strength = new THREE.Vector2(0.5, 1.5)

        this.parameters.hue = new THREE.Vector2(0.9, 1)

        this.parameters.offsetX = new THREE.Vector2(-0.02, 0.02)
        this.parameters.offsetY = new THREE.Vector2(-0.05, 0.05)
    }

    getInstance(id) {
        return new Brush(this, id)
    }

    addInteractiveBrush(touches, count) {
        for (var i = 0; i < count; i++) {
            console.log(`${this.constructor.name}: add ${this.instanceId}`);
            const instance = new InteractiveBrush(this, this.instanceId, touches)
            this.instances.push(instance)
            this.instanceId++
        }
    }

    setupDebug() {
        this.debug = this.experience.debug
        // Debug
        if (this.debug.active) {

            console.log(this.parameters.hsvShift);
            this.folder = this.debug.ui.addFolder('brush')
        }
    }

    updateBrushMaterials() {
        for (var instance of this.instances) {
            instance.updateMaterial()
        }
    }
}
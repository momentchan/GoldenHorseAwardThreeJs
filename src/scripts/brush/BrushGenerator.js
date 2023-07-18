import * as THREE from 'three'
import Brush from "./Brush"
import InteractiveBrush from './InteractiveBrush'
import Generator from '../basis/Generator'

export default class BrushGenerator extends Generator {
    constructor(experience) {
        super(experience)

        this.setupDebug()
        this.startGenerateInstances()

        this.touch = this.experience.touch
        this.minTouches = 10
        this.minLength = 0.05

        this.counts = [5, 5, 3] // (initial, ontime, delay)


        for (var i = 0; i < this.counts[0]; i++) {
            this.addInstance()
        }

        this.touch.on('onEnd', () => {
            if (this.touch.touches.length > this.minTouches) {
                const touches = this.touch.touches
                const from = touches[0]
                const to = touches[touches.length - 1]
                const distance = from.distanceTo(to)
                if (distance > this.minLength) {
                    this.addInteractiveBrush(from, to)
                }
            }
        })
    }

    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(2, 3)
        this.parameters.ratio = new THREE.Vector2(1, 5)
        this.parameters.size = new THREE.Vector2(0.1, 0.2)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = new THREE.Vector2(3.0, 5.0)
        this.parameters.distortionStrength = new THREE.Vector2(0.01, 0.03)

        this.parameters.strength = new THREE.Vector2(0.5, 1.5)

        this.parameters.hue = this.isMagicHour ? new THREE.Vector2(0.97, 1.05) : new THREE.Vector2(0.9, 1.0)

        // interactive
        this.parameters.offsetX = new THREE.Vector2(-0.02, 0.02)
        this.parameters.offsetY = new THREE.Vector2(-0.05, 0.05)

        this.parameters.delay = new THREE.Vector2(1000, 3000)
    }

    getInstance(id) {
        return new Brush(this, id)
    }

    addInteractiveBrush(from, to) {
        for (var i = 0; i < this.counts[1]; i++) {
            // console.log(`${this.constructor.name}: add ${this.instanceId}`);
            const instance = new InteractiveBrush(this, this.instanceId, from, to, false)
            this.instances.push(instance)
            this.instanceId++
        }

        for (var i = 0; i < this.counts[2]; i++) {
            // console.log(`${this.constructor.name}: add ${this.instanceId}`);
            const instance = new InteractiveBrush(this, this.instanceId, from, to, true)
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
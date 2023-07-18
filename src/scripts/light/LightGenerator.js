import * as THREE from 'three'
import Generator from '../basis/Generator'
import Light from './Light'

export default class LightGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.touch = this.experience.touch

        this.touch.on('click', () => {
            this.addLight(this.touch.click)
        })

    }

    setupParameters() {
        super.setupParameters()

        this.parameters.count = 400
        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(10, 10)
        this.parameters.generateInterval = new THREE.Vector2(5, 15)
        this.parameters.speed = 0.00002

        // interaction
        this.parameters.size = new THREE.Vector2(0.2, 0.25)
        this.parameters.fractalScale = new THREE.Vector2(2, 10)
        this.parameters.fractalStrength = new THREE.Vector2(0.1, 0.3)
    }

    addLight(pos) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Light(this, this.instanceId, pos)
        this.instances.push(instance)
        this.instanceId++
    }

    update() {
        super.update()
    }
}
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

        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(10, 10)
        this.parameters.size = new THREE.Vector2(0.3, 0.5)
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
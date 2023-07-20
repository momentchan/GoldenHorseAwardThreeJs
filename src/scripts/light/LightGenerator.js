import * as THREE from 'three'
import Generator from '../basis/Generator'
import Light from './Light'
import Paint from './Paint'
import { randomRange } from '../../three.js-gist/Utils/Helper'

export default class LightGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.touch = this.experience.touch

        this.paintTex = [
            this.items.paintTex1,
            this.items.paintTex2,
            this.items.paintTex3,
            this.items.paintTex4,
            this.items.paintTex5,
            this.items.paintTex6,
        ]

        this.touch.on('click', () => {
            const strength = Math.random() < 0.8 ? this.parameters.strength.x : this.parameters.strength.y
            const size = randomRange(this.parameters.size)
            this.addLight(this.touch.click, size, strength)
            this.addPaint(this.touch.click, size, strength)
        })

    }
    getPaintTex() {
        return this.paintTex[this.instanceId % this.paintTex.length]
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(10, 10)
        this.parameters.size = new THREE.Vector2(0.3, 0.5)
        this.parameters.strength = new THREE.Vector2(0.2, 1.0)
    }

    addLight(pos, size, strength) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Light(this, this.instanceId, pos, size, strength)
        this.instances.push(instance)
        this.instanceId++
    }

    addPaint(pos, size, strength) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Paint(this, this.instanceId, pos, size, strength)
        this.instances.push(instance)
        this.instanceId++
    }

    update() {
        super.update()
    }
}
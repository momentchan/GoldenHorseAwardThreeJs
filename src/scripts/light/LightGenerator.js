import * as THREE from 'three'
import Generator from '../basis/Generator'
import Light from './Light'
import Paint from './Paint'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import { MathUtils } from 'three'

export default class LightGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.touch = this.experience.touch
        this.autoSpawn = true

        this.paintTex = [
            this.items.paintTex1,
            this.items.paintTex2,
            this.items.paintTex3,
            this.items.paintTex4,
            this.items.paintTex5,
            this.items.paintTex6,
        ]

        if (this.autoSpawn)
            this.startGenerateInstances()

        this.touch.on('click', () => {
            this.addInstance(this.touch.click)
        })
    }

    getPaintTex() {
        return this.paintTex[this.instanceId % this.paintTex.length]
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = this.isMobile ? new THREE.Vector2(7, 7) : new THREE.Vector2(10, 10)
        this.parameters.generateInterval = new THREE.Vector2(2, 3)
        this.parameters.size = new THREE.Vector2(0.2, 0.4)
        this.parameters.strength = new THREE.Vector2(0.5, 1.0)
        this.parameters.color = this.isMagicHour ? new THREE.Vector3(0.77, 0.46, 0.53) : new THREE.Vector3(1, 1, 1)
    }

    addInstance(pos) {
        const strength = Math.random() < 0.8 ? this.parameters.strength.x : this.parameters.strength.y
        const size = randomRange(this.parameters.size)

        const ratio =
            this.isMobile ?
                MathUtils.randFloat(1, 1.2) :
                Math.random() < 0.8 ? MathUtils.randFloat(1, 1.5) : MathUtils.randFloat(2, 3)

        const dir = Math.random() < 0.5 ? 1 : -1
        this.addLight(pos, new THREE.Vector2(size * ratio, size), strength, dir)
        this.addPaint(pos, new THREE.Vector2(size * ratio, size), strength, dir)
    }

    addLight(pos, size, strength, dir) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Light(this, this.instanceId, pos, size, strength, dir)
        this.instances.push(instance)
        this.instanceId++
    }

    addPaint(pos, size, strength, dir) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Paint(this, this.instanceId, pos, size, strength, dir)
        this.instances.push(instance)
        this.instanceId++
    }

    startGenerateInstances() {
        const interval = MathUtils.randFloat(this.parameters.generateInterval.x, this.parameters.generateInterval.y) * 1000
        setTimeout(() => {
            const pos = new THREE.Vector2(MathUtils.randFloat(-1, 1), MathUtils.randFloat(-1, 1))
            this.addInstance(pos)
            this.startGenerateInstances()
        }, interval);
    };
}
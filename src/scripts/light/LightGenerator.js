import * as THREE from 'three'
import Generator from '../basis/Generator'
import Light from './Light'
import RTWriter from '../../three.js-gist/Feature/RTWriter/RTWriter'

export default class LightGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.touch = this.experience.touch

        this.writer = new RTWriter(this.experience, this.camera, 0.5)
        this.experience.renderer.composer.passes[1].uniforms.uLightTex.value = this.writer.getTexture()

        this.touch.on('click', () => {
            this.addLight(this.touch.click)
        })

    }

    getLightTex() { 
        // return this.writer.getTexture() 
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.count = 400
        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(10, 10)
        this.parameters.generateInterval = new THREE.Vector2(5, 15)
        this.parameters.speed = 0.00002

        // interaction
        this.parameters.size = new THREE.Vector2(0.2, 0.5)
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
        this.writer.update()
    }
}
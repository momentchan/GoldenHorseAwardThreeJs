import * as THREE from 'three'
import Generator from '../basis/Generator'
import FractalLayer from './FractalLayer'

export default class FractalLayerGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.addInstance()
        this.startGenerateInstances()
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.count = 400
        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(5, 15)
        this.parameters.speed = 0.00002

        // interaction
        this.parameters.size = new THREE.Vector2(0.05, 0.2)
        this.parameters.fractalScale = new THREE.Vector2(2, 10)
        this.parameters.fractalStrength = new THREE.Vector2(0.1, 0.3)
    }

    getInstance(id) {
        return new FractalLayer(this, id)
    }
}
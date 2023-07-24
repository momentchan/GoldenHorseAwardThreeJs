import * as THREE from 'three'
import Generator from '../basis/Generator'
import FractalLayer from './FractalLayer'

export default class FractalLayerGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.startGenerateInstances()
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.distanceToCamera = 1.5
        this.parameters.lifetime = this.isMobile ? new THREE.Vector2(10, 20) : new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(5, 15)
        this.parameters.speed = 0.02
    }

    getInstance(id) {
        return new FractalLayer(this, id)
    }
}
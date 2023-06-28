import * as THREE from 'three'
import Generator from '../basis/Generator'
import FractalLayer from './FractalLayer'

export default class FractalLayerGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.generateInstance()
        this.startGenerateInstances()
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.count = 400
        this.parameters.distanceToCamera = 1
        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(5, 15)
    }

    getInstance() { 
        return new FractalLayer(this, this.instanceId)
    }
}
import * as THREE from 'three'
import LineInstanced from "./LineInstanced"
import Generator from '../../basis/Generator'

export default class LineInstancedGenerator extends Generator {

    constructor(experience) {
        super(experience)
        this.addInstance()
    }

    setupParameters() {
        super.setupParameters()

        this.parameters.count = 400
        this.parameters.distanceToCamera = 4
        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(10, 20)

        this.parameters.wRange = new THREE.Vector2(0.5, 1).multiplyScalar(2.5)
        this.parameters.hRange = new THREE.Vector2(0.3, 0.5).multiplyScalar(0.01)
    }

    getInstance(id) { 
        return new LineInstanced(this, id)
    }
}
import * as THREE from 'three'
import Generator from '../basis/Generator'
import Paint from './Paint'

export default class PaintGenerator extends Generator {
    constructor(experience) {
        super(experience)

        this.paintTex = [
            this.items.paintTex1,
            this.items.paintTex2,
            this.items.paintTex3,
        ]

        // this.addInstance()
        // this.startGenerateInstances()

        this.touch = this.experience.touch
        this.touch.on('click', () => {
            this.addPaint(this.touch.click)
        })
    }

    getPaintTex() {
        return this.paintTex[this.instanceId % this.paintTex.length]
    }

    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(10, 10)
        this.parameters.generateInterval = new THREE.Vector2(3, 5)
        this.parameters.size = new THREE.Vector2(0.3, 0.5)
        this.parameters.strength = new THREE.Vector2(0.2, 1.0)
    }

    getInstance(id) {
        return new Paint(this, id)
    }

    addPaint(pos) {
        // console.log(`${this.constructor.name}: add ${this.instanceId}`);
        const instance = new Paint(this, this.instanceId, pos)
        this.instances.push(instance)
        this.instanceId++
    }

    updateBrushMaterials() {
        for (var instance of this.instances) {
            instance.updateMaterial()
        }
    }
}
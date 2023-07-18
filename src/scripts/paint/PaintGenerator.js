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

        this.addInstance()
        this.startGenerateInstances()
    }

    getPaintTex() {
        return this.paintTex[Math.floor(Math.random() * this.paintTex.length)]
    }

    setupParameters() {
        super.setupParameters()
        this.parameters.distanceToCamera = 1

        this.parameters.lifetime = new THREE.Vector2(20, 30)
        this.parameters.generateInterval = new THREE.Vector2(3, 5)
        this.parameters.ratio = new THREE.Vector2(1, 5)
        this.parameters.size = new THREE.Vector2(0.3, 0.5)
        this.parameters.speed = new THREE.Vector2(0.5, 1)
        this.parameters.distortionFrequency = new THREE.Vector2(3.0, 5.0)
        this.parameters.distortionStrength = new THREE.Vector2(0.01, 0.03)

        this.parameters.strength = new THREE.Vector2(0.2, 1.0)

        this.parameters.hue = this.isMagicHour ? new THREE.Vector2(0.97, 1.05) : new THREE.Vector2(0.9, 1.0)

        // interactive
        this.parameters.offsetX = new THREE.Vector2(-0.02, 0.02)
        this.parameters.offsetY = new THREE.Vector2(-0.05, 0.05)

        this.parameters.delay = new THREE.Vector2(1000, 3000)
    }

    getInstance(id) {
        return new Paint(this, id)
    }

    updateBrushMaterials() {
        for (var instance of this.instances) {
            instance.updateMaterial()
        }
    }
}
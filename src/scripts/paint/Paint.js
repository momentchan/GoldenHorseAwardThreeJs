import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../three.js-gist/Utils/Helper'
import vertexShader from '../../three.js-gist/Shader/ScreenVertex.js'
import { fragmentShader } from '../../shaders/PaintShader'
import Instance from '../basis/Instance'

export default class Paint extends Instance {
    constructor(generator, id) {
        super(generator, id)

        this.setupMesh()
    }

    setupMesh() {
        const cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        const { w, h } = this.camera.getWorldSizeAtDistance(this.parameters.distanceToCamera)

        const size = randomRange(this.parameters.size) * MathUtils.lerp(1, 1.5, (w - 0.15) / (0.95 - 0.15)) // make the size in proportion to screen size

        const geometry = new THREE.PlaneGeometry(size, size, 1, 1)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uBackgroundTex: { value: this.isMagicHour ? this.items.backgroundRedTex : this.items.backgroundBlueTex },
                uPaintTex: { value: this.generator.getPaintTex() },

                uStrength: { value: Math.random() < 0.8 ?　this.parameters.strength.x : this.parameters.strength.y },
                uRatio: { value: 0 },
            },
        })

        const position = new THREE.Vector3((Math.random() - 0.5) * w,
            (Math.random() - 0.5) * h,
            cameraWorldPos.z + this.parameters.distanceToCamera)

        // position.setX(0)
        // position.setY(0)
        const angle = 0//Math.random() * Math.PI * 2

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.position.set(position.x, position.y, position.z)

        this.scene.add(this.mesh);
    }

    update() {
        super.update()

        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }
}
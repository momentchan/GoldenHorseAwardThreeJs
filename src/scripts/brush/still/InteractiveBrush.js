import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../../three.js-gist/Utils/Helper'
import vertexShader from '../../../shaders/brushStill/vertex.glsl'
import fragmentShader from '../../../shaders/brushStill/fragment.glsl'
import Instance from '../../basis/Instance'

export default class InteractiveBrush extends Instance {

    constructor(generater, id, from, to) {
        super(generater, id)
        this.lifetime = 5000
        this.setupMesh(from, to)
    }

    setupMesh(from, to) {

        const wfrom = this.getWorldPosFromNDC(from, 5)
        const wto = this.getWorldPosFromNDC(to, 5)

        var distance = wfrom.distanceTo(wto);
        console.log('Distance:', distance);

        var direction = new THREE.Vector3();
        direction.subVectors(wto, wfrom).normalize();
        console.log('Direction:', direction);

        var center = new THREE.Vector3();
        center.lerpVectors(wfrom, wto, 0.5);

        const geometry = new THREE.PlaneGeometry(distance * 0.2, distance, 1, 40)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uPaperTex: { value: this.items.backgroundTex },
                uStrokeTex: { value: this.items.brushStillTex },

                uDistortionFrequency: { value: randomRange(this.parameters.distortionFrequency) },
                uDistortionStrength: { value: randomRange(this.parameters.distortionStrength) },
                uStrength: { value: randomRange(this.parameters.strength) },
                uHue: { value: randomRange(this.parameters.hue) },
                uSaturation: { value: this.parameters.saturation },
                uValue: { value: this.parameters.value },
                uRatio: { value: 0 },
                uSeed: { value: Math.random() }
            },
        })

        // this.material = new THREE.MeshBasicMaterial()

        const cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        const angle = -Math.atan2(direction.y, direction.x)

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(angle)
        this.mesh.rotateZ(MathUtils.degToRad(90))
        this.mesh.position.set(center.x, center.y, center.z)

        this.scene.add(this.mesh);
    }

    update() {
        super.update()

        this.material.uniforms.uRatio.value = this.age

        if (this.age > 1)
            this.destroy()
    }

    getWorldPosFromNDC(ndc, distance) {
        var vector = new THREE.Vector3(ndc.x, ndc.y, 0.2);

        const cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        vector.unproject(this.camera.instance);

        var direction = vector.sub(cameraWorldPos).normalize();

        var position = cameraWorldPos.clone().add(direction.multiplyScalar(distance));
        return position
    }
}
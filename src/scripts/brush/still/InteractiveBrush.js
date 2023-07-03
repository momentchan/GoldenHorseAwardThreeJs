import * as THREE from 'three'
import { MathUtils } from 'three'
import { randomRange } from '../../../three.js-gist/Utils/Helper'
import vertexShader from '../../../shaders/brushInteractive/vertex.glsl'
import fragmentShader from '../../../shaders/brushInteractive/fragment.glsl'
import Instance from '../../basis/Instance'

export default class InteractiveBrush extends Instance {

    constructor(generater, id, touches) {
        super(generater, id)
        this.lifetime = 5000
        this.distanceToCamera = 3
        this.setupMesh(touches)
        




       

    }







    setupMesh(touches) {
        const from = touches[0]
        const to = touches[touches.length - 1]

        this.computeDataTexture(touches)
        
        const wfrom = this.getWorldPosFromNDC(from, 5)
        const wto = this.getWorldPosFromNDC(to, 5)
        var distance = wfrom.distanceTo(wto);

        var direction = new THREE.Vector3();
        direction.subVectors(wto, wfrom).normalize();

        var center = new THREE.Vector3();
        center.lerpVectors(wfrom, wto, 0.5);

        const geometry = new THREE.PlaneGeometry(distance * 0.2, distance, 1, 50)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uPaperTex: { value: this.items.backgroundTex },
                uStrokeTex: { value: this.items.brushStillTex },
                uPositionTex: { value: this.positionTex },
                uNormalTex: { value: this.normalTex },

                uStrength: { value: randomRange(this.parameters.strength) },
                uHue: { value: randomRange(this.parameters.hue) },
                uSaturation: { value: this.parameters.saturation },
                uValue: { value: this.parameters.value },
                uRatio: { value: 0 },
                uSeed: { value: Math.random() },
                uWorldCenter: { value: wfrom }
            },
        })

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

    computeDataTexture(touches) {
        const count = touches.length - 2; // ommit the first and last point to compute the normal
        const positionData = new Float32Array(count * 4);
        const normalData = new Float32Array(count * 4);

        const worldPos = []

        for (var i = 0; i < touches.length; i++) {
            worldPos.push(this.getWorldPosFromNDC(touches[i], this.distanceToCamera))
        }

        for (var i = 1; i < touches.length - 1; i++) {

            const pre = worldPos[i - 1]
            const pos = worldPos[i]
            const next = worldPos[i + 1]

            const id = 4 * (i - 1);
            positionData[id] = pos.x
            positionData[id + 1] = pos.y
            positionData[id + 2] = pos.z
            positionData[id + 3] = 0

            const normal = next.clone().sub(pre)
            normal.normalize()
            if (i > 1) {
                const preId = id - 4
                const preNormal = new THREE.Vector3(normalData[preId], normalData[preId + 1], normalData[preId + 2])

                normal.lerpVectors(preNormal, normal, 0.5)
            }

            normalData[id] = normal.x
            normalData[id + 1] = normal.y
            normalData[id + 2] = normal.z
            normalData[id + 3] = 0
        }

        this.positionTex = new THREE.DataTexture(positionData, 1, count, THREE.RGBAFormat, THREE.FloatType)
        this.normalTex = new THREE.DataTexture(normalData, 1, count, THREE.RGBAFormat, THREE.FloatType)

        this.positionTex.needsUpdate = true
        this.normalTex.needsUpdate = true
        // console.log(positionData); 
        // console.log(normalData); 
        // console.log(this.positionTex);
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
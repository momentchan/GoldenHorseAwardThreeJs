import * as THREE from 'three'
import CameraBase from "../three.js-gist/Common/CameraBase"
import { remap } from "../three.js-gist/Utils/Helper"
import { isValueInRange } from "../three.js-gist/Utils/Helper"

export default class Camera extends CameraBase {
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            20,
            this.sizes.width / this.sizes.height,
            0.1,
            1000)
        this.cameraGroup = new THREE.Group()
        this.cameraGroup.add(this.instance)
        this.instance.position.z = -8
        this.gyro = this.experience.gyro

        this.gammaRange = new THREE.Vector2(-20, 20)
        this.betaRange = new THREE.Vector2(70, 110)

        this.scene.add(this.cameraGroup)
    }

    setOrbitControl() {
        super.setOrbitControl()
        this.controls.enabled = false
    }

    update() {
        // this.cameraGroup.position.z -= 0.001
        const pos = this.cameraGroup.position

        const x = isValueInRange(this.gyro.gamma, this.gammaRange.x, this.gammaRange.y) ? remap(this.gyro.gamma, this.gammaRange.x, this.gammaRange.y, -0.05, 0.05) : pos.x
        const y = isValueInRange(this.gyro.beta, this.betaRange.x, this.betaRange.y) ? remap(this.gyro.beta, this.betaRange.x, this.betaRange.y, -0.05, 0.05) : pos.y

        this.cameraGroup.position.x = THREE.MathUtils.lerp(pos.x, x, 0.5)
        this.cameraGroup.position.y = THREE.MathUtils.lerp(pos.y, y, 0.5)
        this.cameraGroup.position.z = pos.z
        // this.cameraGroup.lookAt(0, 0, -3)
    }
}
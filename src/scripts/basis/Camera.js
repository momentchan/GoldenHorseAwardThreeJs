import * as THREE from 'three'
import CameraBase from "../../three.js-gist/Common/CameraBase"
import { remap } from "../../three.js-gist/Utils/Helper"
import { isValueInRange } from "../../three.js-gist/Utils/Helper"

export default class Camera extends CameraBase {
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            20,
            this.sizes.width / this.sizes.height,
            0.1,
            1000)
        this.cameraGroup = new THREE.Group()
        this.cameraGroup.add(this.instance)
        this.instance.position.z = -15
        this.gyro = this.experience.gyro

        this.gammaRange = new THREE.Vector2(-180, 180)
        this.betaRange = new THREE.Vector2(0, 180)
        this.moveRange = new THREE.Vector2(0.1, 0.1)

        this.scene.add(this.cameraGroup)
    }

    setOrbitControl() {
        super.setOrbitControl()
        this.controls.enabled = false
    }

    update() {
        this.cameraGroup.position.z -= 0.0005
        const pos = this.cameraGroup.position

        const x = isValueInRange(this.gyro.gamma, this.gammaRange.x, this.gammaRange.y) ? remap(this.gyro.gamma, this.gammaRange.x, this.gammaRange.y, -this.moveRange.x, this.moveRange.x) : pos.x
        const y = isValueInRange(this.gyro.beta, this.betaRange.x, this.betaRange.y) ? remap(this.gyro.beta, this.betaRange.x, this.betaRange.y, -this.moveRange.y, this.moveRange.y) : pos.y

        this.cameraGroup.position.x = THREE.MathUtils.lerp(pos.x, x, 0.2)
        this.cameraGroup.position.y = THREE.MathUtils.lerp(pos.y, y, 0.2)
        this.cameraGroup.position.z = pos.z
    }
}
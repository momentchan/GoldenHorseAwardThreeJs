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
        this.cameraGroup.position.z -= 0.0003
        const pos = this.cameraGroup.position
    }
}
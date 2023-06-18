import * as THREE from 'three'
import CameraBase from "../three.js-gist/Common/CameraBase"

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

        this.scene.add(this.cameraGroup)
    }
    setOrbitControl() {
        super.setOrbitControl()
    }

    update() {
        this.cameraGroup.position.z -= 0.0005
    }
}
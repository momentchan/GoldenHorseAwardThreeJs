import * as THREE from 'three'
import CameraBase from "../../three.js-gist/Common/CameraBase"

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
        this.scene.add(this.cameraGroup)

        const helper = new THREE.CameraHelper( this.instance );
        this.scene.add(helper)
    }

    setOrbitControl() {
        super.setOrbitControl()
        this.controls.enabled = false
    }

    update() {
        this.cameraGroup.position.z -= 0.003
    }
}
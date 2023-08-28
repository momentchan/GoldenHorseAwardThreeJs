import * as THREE from 'three'
import CameraBase from '../../three.js-gist/Common/CameraBase'

export default class DebugCamera extends CameraBase {
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            20,
            this.sizes.width / this.sizes.height,
            0.1,
            1000)
        this.instance.position.z = -15
        this.scene.add(this.instance)
    }
    setOrbitControl() {
        super.setOrbitControl()
        this.controls.enabled = true
        this.controls.zoomSpeed = 0.1
        this.controls.rotateSpeed = 0.1
        this.controls.panSpeed = 0.1
    }

    update() {
        super.update()
        this.instance.position.z -= 0.006

        var pos = this.target.getWorldPos()
        pos.z += 2
        this.controls.target = pos
    }
}
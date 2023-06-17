import * as THREE from 'three'
import CameraBase from "../three.js-gist/Common/CameraBase"

export default class Camera extends CameraBase {
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            20, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            1000)
        this.instance.position.z = -5
        this.scene.add(this.instance)
    }
    setOrbitControl() {
        super.setOrbitControl()
    }

    update(){
        // this.instance.position.z -= 0.001
    }
}
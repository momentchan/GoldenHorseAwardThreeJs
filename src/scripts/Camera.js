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
        this.gyro = this.experience.gyro


        this.scene.add(this.cameraGroup)
    }

    setOrbitControl() {
        super.setOrbitControl()
        this.controls.enabled = false
    }
    remap(value, oldMin, oldMax, newMin, newMax) {
        const clampedValue = Math.max(oldMin, Math.min(value, oldMax));

        // Normalize the clamped value within the old range
        const normalizedValue = (clampedValue - oldMin) / (oldMax - oldMin);

        // Remap the normalized value to the new range
        const remappedValue = normalizedValue * (newMax - newMin) + newMin;

        return remappedValue;
    }

    update() {
        this.cameraGroup.position.z -= 0.001
        const pos = this.cameraGroup.position

        const x = this.remap(this.gyro.gamma, -20, 20, -0.05, 0.05)
        const y = this.remap(this.gyro.beta, 70, 110, -0.05, 0.05)

        this.cameraGroup.position.x = THREE.MathUtils.lerp(pos.x, x, 0.5)
        this.cameraGroup.position.y = THREE.MathUtils.lerp(pos.y, y, 0.5)
        this.cameraGroup.position.z = pos.z
        // this.cameraGroup.lookAt(0, 0, -3)
    }
}
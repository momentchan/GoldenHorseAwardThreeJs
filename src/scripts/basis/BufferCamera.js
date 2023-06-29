import * as THREE from 'three'
import CameraBase from "../../three.js-gist/Common/CameraBase"

export default class BufferCamera extends CameraBase {
    setInstance() {
        this.instance = new THREE.OrthographicCamera( this.sizes.width / - 2, this.sizes.width / 2, this.sizes.height / 2, this.sizes.height / - 2, - 10000, 10000 );
        this.instance.position.set(0,0,10)
        this.instance.lookAt(0, 0, 0)
    }
}
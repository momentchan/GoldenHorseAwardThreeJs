import * as THREE from 'three'
import { MathUtils } from 'three'

export default class FractalLayer {
    constructor(generater, id) {
        // this.experience = experience

        // this.camera = this.experience.camera
        // this.cameraGroup = this.camera.cameraGroup

        // var fovRadians = THREE.MathUtils.degToRad(this.camera.instance.fov);
        // var d = Math.abs(this.camera.instance.position.z)
        // var h = 2 * Math.tan(fovRadians * 0.5) * d;
        // var w = h * this.camera.instance.aspect;

        // const geometry = new THREE.PlaneGeometry(w, h, 1, 1);

        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: screenVertexShader,
        //     fragmentShader: backgroundFractalFragmentShader,
        //     side: THREE.DoubleSide,
        //     transparent: true,
        //     uniforms: {
        //         uTime: { value: 0 },
        //         uSpeed: { value: 0.0001 },
        //         uTexture: { value: this.experience.resources.items.backgroundTex }
        //     }
        // })
        // const plane = new THREE.Mesh(geometry, this.material)
        // this.cameraGroup.add(plane)
        // setInterval(this.addPlaneGeometry, 1000);


        this.generater = generater

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y) * 1000

        this.scene = this.generater.scene
        this.camera = this.generater.camera

        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        material.side = THREE.DoubleSide
        this.plane = new THREE.Mesh(geometry, material);

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.plane.position.z = cameraWorldPos.z + 1;
        this.scene.add(this.plane);
    }

    update() {
        this.t += this.time.delta
        const r = this.t / this.lifetime
        // console.log(r)
        if (r > 1) {
            this.destroy()
        }
    }

    destroy() {
        this.generater.removeLayerFromList(this.id)

        // Remove the plane from the scene
        this.scene.remove(this.plane);

        // Dispose the plane's geometry and material
        this.plane.geometry.dispose();
        this.plane.material.dispose();

        delete this
    }
}
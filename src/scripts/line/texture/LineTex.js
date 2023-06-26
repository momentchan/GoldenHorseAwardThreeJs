import * as THREE from 'three'
import { MathUtils } from 'three'
import screenVertexShader from '../../../shaders/screen_vertex.glsl'
import lineFragmentShader from '../../../shaders/lineTex/fragment.glsl'


export default class LineTex {

    constructor(generater, id) {
        this.id = id

        this.generater = generater

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y) * 1000

        this.scene = this.generater.scene
        this.camera = this.generater.camera

        const geometry = new THREE.PlaneGeometry(0.3, 0.3);

        
        this.material = new THREE.ShaderMaterial({
            vertexShader: screenVertexShader,
            fragmentShader: lineFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.00002 },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uColorTex: { value: this.generater.getRandomTex() },
                uPaperTex: { value: this.generater.experience.resources.items.paperTex2 }
            }
        })


        this.mesh = new THREE.Mesh(geometry, this.material);

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.position.z = cameraWorldPos.z + this.generater.distanceToCamera;
        this.scene.add(this.mesh);
    }


    update() {
        this.t += this.time.delta
        const r = this.t / this.lifetime
        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uRatio.value = r

        // console.log(r)
        if (r > 1) {
            this.destroy()
        }
    }

    destroy() {
        this.generater.removeLineFromList(this.id)

        // Remove the plane from the scene
        this.scene.remove(this.mesh);

        // Dispose the plane's geometry and material
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        delete this
    }
}
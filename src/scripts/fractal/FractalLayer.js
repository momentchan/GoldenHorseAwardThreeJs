import * as THREE from 'three'
import { MathUtils } from 'three'
import screenVertexShader from '../../shaders/screen_vertex.glsl'
import fractalLayerFragmentShader from '../../shaders/fractalLayer/fragment.glsl'

export default class FractalLayer {
    constructor(generater, id) {
        this.id = id

        this.generater = generater

        this.t = 0
        this.time = this.generater.experience.time
        this.lifetime = MathUtils.randFloat(this.generater.lifetime.x, this.generater.lifetime.y) * 1000

        this.scene = this.generater.scene
        this.camera = this.generater.camera

        const size = this.camera.getWorldSizeAtDistance(this.generater.distanceToCamera)
        // const geometry = new THREE.PlaneGeometry(size[0], size[1]);
        const geometry = new THREE.PlaneGeometry(0.7, 0.7);

        this.material = new THREE.ShaderMaterial({
            vertexShader: screenVertexShader,
            fragmentShader: fractalLayerFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            
            // blending: THREE.CustomBlending,
            // blendEquation: THREE.AddEquation,
            // blendSrc: THREE.SrcAlphaFactor,
            // blendDst: THREE.OneFactor,

            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.00002 },
                uSeed: { value: Math.random() },
                uRatio: { value: 0 },
                uColorTex: { value: this.generater.experience.resources.items.backgroundTex },
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
        this.generater.removeLayerFromList(this.id)

        // Remove the plane from the scene
        this.scene.remove(this.mesh);

        // Dispose the plane's geometry and material
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        delete this
    }
}
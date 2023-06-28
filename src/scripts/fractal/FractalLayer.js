import * as THREE from 'three'
import screenVertexShader from '../../shaders/screen_vertex.glsl'
import fractalLayerFragmentShader from '../../shaders/fractalLayer/fragment.glsl'
import Instance from '../basis/Instance'

export default class FractalLayer extends Instance {
    setupMesh(){
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
                uColorTex: { value: this.items.backgroundTex },
                uPaperTex: { value: this.items.paperTex2 }
            }
        })

        this.mesh = new THREE.Mesh(geometry, this.material);

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.position.z = cameraWorldPos.z + this.parameters.distanceToCamera;
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
}
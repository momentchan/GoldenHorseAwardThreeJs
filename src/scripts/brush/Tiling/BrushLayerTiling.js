import * as THREE from 'three'
import { MathUtils } from 'three'
import instancedVertexShader from '../../../shaders/brushNew/instanced_vertex_new.glsl'
import brushFragmentShader from '../../../shaders/brushNew/fragment.glsl'

export default class BrushLayerTiling {
    constructor(brush, type) {
        this.brush = brush
        this.scene = this.brush.scene
        this.camera = this.brush.camera
        this.items = this.brush.items

        this.experience = this.brush.experience
        this.type = type

        this.parameters = this.brush.parameters

        const sizes = this.parameters[this.type].sizes
        const count = this.parameters[this.type].count
        const layer = this.parameters[this.type].layer
        const width = this.parameters[this.type].width
        const height = this.parameters[this.type].height
        const strength = this.parameters[this.type].strength

        const hueShift = this.parameters[this.type].hueShift
        const colorStrength = this.parameters[this.type].colorStrength

        const size = MathUtils.randFloat(sizes.x, sizes.y)
        const distortionFrequency = this.parameters[this.type].distortionFrequency
        const distortionStrength = this.parameters[this.type].distortionStrength

        const geometry = new THREE.PlaneGeometry(0.25 * size, 1 * size, 1, 10)

        this.material = new THREE.ShaderMaterial({
            vertexShader: instancedVertexShader,
            fragmentShader: brushFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uDistortionFrequency: { value: distortionFrequency },
                uDistortionStrength: { value: distortionStrength },

                uColorTex: { value: this.items.backgroundTex },
                uStrokeTex: { value: this.items.strokeTex },
                uCount: { value: count },
                uLayer: { value: layer },
                uWitdh: { value: width },
                uHeight: { value: height },
                uStrength: { value: strength },
                uDrawRate: { value: 0.0 },
                uHueShift: { value: hueShift },
                uColorStrength: { value: colorStrength },
                uRatio: { value: 0 }
            },
        })

        this.mesh = new THREE.Mesh(geometry, this.material);

        var cameraWorldPos = new THREE.Vector3();
        this.camera.instance.getWorldPosition(cameraWorldPos)

        this.mesh.rotateY(MathUtils.degToRad(180))
        this.mesh.rotateZ(this.brush.angle)
        this.mesh.position.set(this.brush.position.x, this.brush.position.y, this.brush.position.z)
        this.scene.add(this.mesh);
    }

    update() {
        this.material.uniforms.uDrawRate.value = this.brush.t
        this.material.uniforms.uRatio.value = this.brush.age
    }

    updateMaterial() {
        this.material.uniforms.uStrength.value = this.parameters[this.type].strength
        this.material.uniforms.uColorStrength.value = this.parameters[this.type].colorStrength
        this.material.uniforms.uHueShift.value = this.parameters[this.type].hueShift
        this.material.uniforms.uDistortionFrequency.value = this.parameters[this.type].distortionFrequency
        this.material.uniforms.uDistortionStrength.value = this.parameters[this.type].distortionStrength
        this.material.uniforms.uCount.value = this.parameters[this.type].count
        this.material.uniforms.uWitdh.value = this.parameters[this.type].width
        this.material.uniforms.uHeight.value = this.parameters[this.type].height
    }

    destroy() {
        this.scene.remove(this.mesh);

        // Dispose the plane's geometry and material
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        delete this
    }
}
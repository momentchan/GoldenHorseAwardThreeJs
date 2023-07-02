import * as THREE from 'three'
import { fractalShader } from '../../../shaders/postProcessing/fractalShader'
import Instance from '../../basis/Instance';

export default class LineFractal extends Instance {
    constructor(generator, id) {
        super(generator, id)
        this.setupMesh()
    }
    setupMesh() {
        this.renderer = this.experience.renderer.instance
        this.bufferScene = this.experience.bufferScene
        this.bufferCamera = this.experience.bufferCamera

        const geometry = new THREE.PlaneGeometry(this.sizes.width, this.sizes.height)
        this.rtTexture = new THREE.WebGLRenderTarget(this.sizes.width * 0.02, this.sizes.height * 0.02)

        this.material = new THREE.ShaderMaterial(fractalShader)
        this.material.uniforms.uAspect.value = this.sizes.aspect

        this.mesh = new THREE.Mesh(geometry, this.material)
        this.bufferScene.add(this.mesh)
    }

    getTexture() {
        return this.rtTexture.texture
    }

    update() {
        super.update()
        this.material.uniforms.uTime.value = this.t / 1000
        this.material.uniforms.uSpeed.value = this.parameters.fractalSpeed

        this.renderer.setRenderTarget(this.rtTexture);
        this.renderer.clear();
        this.renderer.render(this.bufferScene, this.bufferCamera.instance)
    }
}
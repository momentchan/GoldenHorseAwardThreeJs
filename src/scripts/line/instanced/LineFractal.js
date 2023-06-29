import * as THREE from 'three'
import { fractalShader } from '../../../shaders/postProcessing/fractalShader'
import Instance from '../../basis/Instance';

export default class LineFractal extends Instance {

    setupMesh() {
        this.renderer = this.experience.renderer.instance
        this.bufferScene = this.experience.bufferScene
        this.bufferCamera = this.experience.bufferCamera

        const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight)
        this.rtTexture = new THREE.WebGLRenderTarget(window.innerWidth * 0.05, window.innerHeight * 0.05)
        console.log(this.rtTexture);

        this.material = new THREE.ShaderMaterial(fractalShader)
        this.material.uniforms.uAspect.value = window.innerWidth / window.innerHeight

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
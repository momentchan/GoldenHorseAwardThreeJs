import * as THREE from 'three'
import RendererBase from "../../three.js-gist/Common/RendererBase"
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { BackgroundOverlayShader } from '../../shaders/BackgroundOverlayShader';


export default class Renderer extends RendererBase {
    setInstance() {
        super.setInstance()
        this.composer = new EffectComposer(this.instance);
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            // Render pass
            const renderPass = new RenderPass(this.scene, this.camera.instance)
            this.composer.addPass(renderPass)
            this.composer

            // Custom Pass
            const copyPass = new ShaderPass(BackgroundOverlayShader)
            copyPass.material.uniforms.uTexture.value = this.experience.resources.items.backgroundOverlay
            this.composer.addPass(copyPass)

             const GammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
            //  this.composer.addPass(GammaCorrectionPass)
        })
    }

    update() {
        this.composer.render()
    }
}